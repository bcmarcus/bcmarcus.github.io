// Google.js
const { google } = require ('googleapis');
const gmail = google.gmail ('v1');

class Google {
  constructor (user, oAuth2Client) {
    this.user = user;
    this.client = oAuth2Client;
  }

  async sendEmail (raw) {
    const response = await gmail.users.messages.send ({
      userId: 'me',
      resource: {
        raw: raw,
      },
      auth: this.client,
    });
    return response.data;
  }


  async respondEmail (emailId, message) {
    const response = await gmail.users.messages.modify ({
      userId: 'me',
      id: emailId,
      resource: {
        addLabelIds: ['INBOX'],
        removeLabelIds: ['SPAM', 'TRASH'],
      },
      auth: this.client,
    });
    return response.data;
  }

  async writeEmail (to, subject, body) {
    const raw = base64url.encode (
        `To: ${to}\r\n` +
      `Subject: ${subject}\r\n` +
      `\r\n` +
      `${body}`,
    );
    const response = await gmail.users.messages.send ({
      userId: 'me',
      resource: {
        raw: raw,
      },
      auth: this.client,
    });
    return response.data;
  }

  async readRecentEmailHeaders () {
    const response = await gmail.users.messages.list ({
      userId: 'me',
      maxResults: 10,
      auth: this.client,
    });
    return response.data.messages.map ((message) => ({ id: message.id, threadId: message.threadId }));
  }
}
