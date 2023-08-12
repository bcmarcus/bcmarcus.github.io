const { google } = require('googleapis');
const customsearch = google.customsearch('v1');

customsearch.cse.list({
  auth: '<Your Google API Key>',
  cx: '<Your Search Engine ID>',
  q: 'opening times ' + '<name of the establishment>'
}).then(response => {
  console.log(response.data);
}).catch(err => {
  console.log(err);
});