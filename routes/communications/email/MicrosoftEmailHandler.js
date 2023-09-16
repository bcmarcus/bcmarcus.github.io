// Microsoft.js
const MicrosoftGraph = require ('@microsoft/microsoft-graph-client');

class Microsoft {
  constructor (user, oAuth2Client) {
    this.user = user;
    this.client = this.getMicrosoftClient (oAuth2Client);
  }

  async sendEmail (message) {
    const response = await this.client.api ('/me/sendMail').post ({ message });
    return response;
  }

  async respondEmail (emailId, message) {
    const response = await this.client.api (`/me/messages/${emailId}`).update ({
      body: {
        content: message,
        contentType: 'Text',
      },
    });
    return response;
  }

  async writeEmail (to, subject, body) {
    const mail = {
      subject: subject,
      toRecipients: [{
        emailAddress: {
          address: to,
        },
      }],
      body: {
        content: body,
        contentType: 'Text',
      },
    };
    const response = await this.client.api ('/me/messages').post (mail);
    return response;
  }

  async readRecentEmailHeaders () {
    const response = await this.client.api ('/me/messages').get ();
    return response.value.map ((mail) => ({ subject: mail.subject, from: mail.from }));
  }

  getMicrosoftClient (oAuth2Client) {
    const client = MicrosoftGraph.Client.initWithMiddleware ({
      authProvider: (done) => {
        done (null, oAuth2Client.credentials.refresh_token);
      },
    });
    return client;
  }
}
