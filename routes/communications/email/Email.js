const firebase = require ('firebase');
// const { google } = require ('googleapis');
const request = require ('request');
const crypto = require ('crypto');

const { getSecret } = require ('../../security/secrets');

// Firestore initialization
const db = firebase.firestore ();

/**
  * Class representing an Email.
  * @class
  */
class Email {
  /**
    * Create an Email instance.
    * @constructor
    * @param {Object} user - The user object from firebase.
    */
  constructor (user) {
    this.user = user;
    this.emailService = user.emailService === 'gmail' ? new GoogleEmail () : new MicrosoftEmail ();

    getSecret ('encryption').then ((key) => {
      this.ENCRYPTION_KEY = key;
    });
  }

  /**
    * Create an Email instance and connect it.
    * @static
    * @async
    * @function create
    * @param {Object} user - The user object.
    * @throws {Error} If an error occurs while creating the instance.
    */
  static async create (user) {
    try {
      const instance = new Email (user);
      await instance.connect ();
      return instance;
    } catch (err) {
      console.log (err);
      throw err;
    }
  }

  /**
    * Connect the Email instance.
    * @async
    * @function connect
    * @throws {Error} If an error occurs while connecting the instance.
    */
  async connect () {
    // Fetch refresh token from Firestore
    const userRef = db.collection ('users').doc (this.user.uid);
    const doc = await userRef.get ();
    if (!doc.exists) {
      // If not exists, create a new user and go through OAuth 2.0 process to obtain a new access token and refresh token
      const authUrl = this.emailService === 'gmail' ?
        this.googleOAuth2Client.generateAuthUrl () :
        ''; // Generate Microsoft auth URL

      console.log (`Please go to the following link and authorize the app: ${authUrl}`);
      // Once the user has authorized the app and obtained an authorization code, exchange it for an access token and refresh token

      const { tokens } = await this.googleOAuth2Client.getToken ('authorizationCode');

      // Encrypt the refresh token
      const encryptedRefreshToken = this.encrypt (tokens.refresh_token);

      // Store the encrypted refresh token in Firestore
      await userRef.set ({ refreshToken: encryptedRefreshToken });
    } else {
      // If already exists, fetch the refresh token from Firestore
      const encryptedRefreshToken = doc.data ().refreshToken;
      const refreshToken = this.decrypt (encryptedRefreshToken);

      // Use the refresh token to obtain a new access token
      const newAccessToken = await this.getNewAccessToken (refreshToken);

      // Use the new access token to authenticate API requests
      this.googleOAuth2Client.setCredentials ({ access_token: newAccessToken });
    }
  }

  /**
    * Encrypt a text.
    * @function encrypt
    * @param {string} text - The text to be encrypted.
    * @return {string} The encrypted text.
    */
  encrypt (text) {
    const iv = crypto.randomBytes (16); // Generate a random IV
    const cipher = crypto.createCipheriv ('aes-256-cbc', this.ENCRYPTION_KEY, iv);
    let encrypted = cipher.update (text, 'utf8', 'hex');
    encrypted += cipher.final ('hex');
    return iv.toString ('hex') + ':' + encrypted; // Prepend the IV to the encrypted data
  }

  /**
    * Decrypt an encrypted text.
    * @function decrypt
    * @param {string} encrypted - The encrypted text to be decrypted.
    * @return {string} The decrypted text.
    */
  decrypt (encrypted) {
    const parts = encrypted.split (':'); // Split the IV and the encrypted data
    const iv = Buffer.from (parts.shift (), 'hex');
    const decipher = crypto.createDecipheriv ('aes-256-cbc', this.ENCRYPTION_KEY, iv);
    let decrypted = decipher.update (parts.join (':'), 'hex', 'utf8');
    decrypted += decipher.final ('utf8');
    return decrypted;
  }


  /**
    * Get a new access token.
    * @async
    * @function getNewAccessToken
    * @param {string} refreshToken - The refresh token.
    * @return {string} The new access token.
    */
  async getNewAccessToken (refreshToken) {
    if (this.emailService === 'gmail') {
      const { tokens } = await this.googleOAuth2Client.refreshAccessToken ();
      return tokens.access_token;
    } else {
      // Use Microsoft OAuth endpoint to obtain a new access token
      const options = {
        method: 'POST',
        url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
          refresh_token: refreshToken,
          client_id: 'client_id',
          client_secret: 'client_secret',
          redirect_uri: 'redirect_uri',
          grant_type: 'refresh_token',
          scope: 'https://graph.microsoft.com/mail.read',
        },
      };
      return new Promise ((resolve, reject) => {
        request (options, function (error, response, body) {
          if (error) reject (error);
          resolve (JSON.parse (body).access_token);
        });
      });
    }
  }

  /**
    * Send a full message.
    * @async
    * @function sendFull
    * @param {Object} message - The message object.
    */
  async sendFull (message) {
    // Use the google or microsoft OAuth2 client to send email based on this.emailService
  }
}

module.exports = Email;
