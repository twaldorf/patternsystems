const clientId = '873248529781-m38sr7u8k8lq20cndsr4ptiv6k1u6ojl.apps.googleusercontent.com'
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(clientId);

async function verifyTokenForId(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });
  const payload = ticket.getPayload();
  const userId = payload.sub;
  const verifyAud = payload.aud.includes(clientId)
  const verity = verifyAud ? userId : false
  return verity
}

module.exports = { verifyTokenForId }
