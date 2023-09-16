const config = require ('../../config/config.js');
const { SecretManagerServiceClient } = require ('@google-cloud/secret-manager');

const secrets = new SecretManagerServiceClient ();

/**
  * Fetches and returns the value of a specified secret from Google Cloud Secret Manager.
  *
  * @async
  * @function getSecret
  * @param {string} secretName - The name of the secret to be retrieved.
  * @param {string} [type='auth'] - The type of secret to be retrieved. Default value is 'auth'.
  * @return {Promise.<string>} A promise that resolves with the secret value as a string.
  * @throws {Error} If an error occurs while accessing the secret.
  */
async function getSecret (secretName, type='auth') {
  const secretVersionName = `projects/${config.prod.googleSecrets.projectID}/secrets/${config.prod.googleSecrets[secretName][type]}/versions/latest`;
  const [version] = await secrets.accessSecretVersion ({ name: secretVersionName });
  return version.payload.data.toString ('utf8');
}

module.exports = getSecret;
