const config = require("../../config/config.js");
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const secrets = new SecretManagerServiceClient();

async function getSecret(secretName, type="auth") {
  const secretVersionName = `projects/${config.prod.googleSecrets.projectID}/secrets/${config.prod.googleSecrets[secretName][type]}/versions/latest`;
  const [version] = await secrets.accessSecretVersion({ name: secretVersionName });
  return version.payload.data.toString("utf8");
}

module.exports = getSecret;