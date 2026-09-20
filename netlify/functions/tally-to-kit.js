// Receives Tally's "New Submission" webhook for the "Get the Warrior ER
// Survival Guide" form and tags the submitter in Kit (api.kit.com), which
// triggers the existing "ER Guide: Tag to Welcome Sequence" automation.
//
// This replaces the Zapier Tally -> Kit zap: Kit's "Add Tag to Subscriber"
// action is a Premium (paid-plan-only) app on Zapier, so this calls Kit's
// API directly instead. Both Tally webhooks and Kit's API are free.
//
// Required environment variables (set in Netlify site settings, never
// committed to the repo):
//   KIT_API_KEY         - Kit API key (Kit > Settings > Advanced > API)
//   TALLY_SIGNING_SECRET - optional; the signing secret set on the Tally
//                          webhook, used to verify requests really come
//                          from Tally. If unset, signature check is skipped.
//   KIT_TAG_NAME         - optional; defaults to "er-guide-lead"

const crypto = require('crypto');

const KIT_API_KEY = process.env.KIT_API_KEY;
const KIT_TAG_NAME = process.env.KIT_TAG_NAME || 'er-guide-lead';
const TALLY_SIGNING_SECRET = process.env.TALLY_SIGNING_SECRET;

function findEmail(fields) {
  if (!Array.isArray(fields)) return null;
  const byType = fields.find((f) => f && f.type === 'INPUT_EMAIL' && f.value);
  if (byType) return byType.value;
  const byLabel = fields.find(
    (f) => f && typeof f.label === 'string' && /email/i.test(f.label) && f.value
  );
  return byLabel ? byLabel.value : null;
}

function findFirstName(fields) {
  if (!Array.isArray(fields)) return null;
  const byLabel = fields.find(
    (f) => f && typeof f.label === 'string' && /first\s*name/i.test(f.label) && f.value
  );
  return byLabel ? byLabel.value : null;
}

function verifySignature(rawBody, signatureHeader) {
  if (!TALLY_SIGNING_SECRET) return true; // no secret configured, skip check
  if (!signatureHeader) return false;
  const expected = crypto
    .createHmac('sha256', TALLY_SIGNING_SECRET)
    .update(rawBody)
    .digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!KIT_API_KEY) {
    console.error('tally-to-kit: missing KIT_API_KEY env var');
    return { statusCode: 500, body: 'Server misconfigured' };
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';

  const signatureHeader =
    (event.headers && (event.headers['tally-signature'] || event.headers['Tally-Signature'])) ||
    null;

  if (!verifySignature(rawBody, signatureHeader)) {
    console.error('tally-to-kit: signature verification failed');
    return { statusCode: 401, body: 'Invalid signature' };
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    console.error('tally-to-kit: invalid JSON body', err);
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const email = findEmail(payload && payload.data && payload.data.fields);
  if (!email) {
    console.error(
      'tally-to-kit: no email field found in submission',
      payload && payload.data && payload.data.submissionId
    );
    return { statusCode: 400, body: 'No email found in submission' };
  }
  const firstName = findFirstName(payload && payload.data && payload.data.fields);

  try {
    // Kit's "tag a subscriber by email" endpoint requires the subscriber to
    // already exist - it does NOT create new subscribers. Upsert them first
    // (this is a safe no-op if they already exist) so first-time submitters
    // don't fail to get tagged.
    const upsertBody = { email_address: email };
    if (firstName) upsertBody.first_name = firstName;

    const subscriberRes = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'X-Kit-Api-Key': KIT_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(upsertBody),
    });

    if (!subscriberRes.ok) {
      const text = await subscriberRes.text();
      console.error('tally-to-kit: failed to create/update Kit subscriber', subscriberRes.status, text);
      return { statusCode: 502, body: 'Failed to create subscriber in Kit' };
    }

    const tagsRes = await fetch('https://api.kit.com/v4/tags', {
      headers: { 'X-Kit-Api-Key': KIT_API_KEY },
    });
    if (!tagsRes.ok) {
      const text = await tagsRes.text();
      console.error('tally-to-kit: failed to list Kit tags', tagsRes.status, text);
      return { statusCode: 502, body: 'Failed to look up Kit tags' };
    }
    const tagsData = await tagsRes.json();
    const tag = (tagsData.tags || []).find(
      (t) => typeof t.name === 'string' && t.name.toLowerCase() === KIT_TAG_NAME.toLowerCase()
    );
    if (!tag) {
      console.error(`tally-to-kit: tag "${KIT_TAG_NAME}" not found in Kit account`);
      return { statusCode: 500, body: `Tag "${KIT_TAG_NAME}" not found in Kit` };
    }

    const tagRes = await fetch(`https://api.kit.com/v4/tags/${tag.id}/subscribers`, {
      method: 'POST',
      headers: {
        'X-Kit-Api-Key': KIT_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (!tagRes.ok) {
      const text = await tagRes.text();
      console.error('tally-to-kit: failed to tag subscriber', tagRes.status, text);
      return { statusCode: 502, body: 'Failed to tag subscriber in Kit' };
    }

    console.log(`tally-to-kit: tagged ${email} with "${KIT_TAG_NAME}"`);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('tally-to-kit: unhandled error', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};
