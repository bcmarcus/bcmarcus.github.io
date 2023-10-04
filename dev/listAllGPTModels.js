const axios = require ('axios');
const getSecret = require ('../routes/security/secrets');

process.env.GOOGLE_APPLICATION_CREDENTIALS = '../config/service_keys/call-to-action-2afc3-82ae4cc2b811.json';
process.env.DEV = true;

async function listModels () {
  process.env.openAIAuth = await getSecret ('openAI');

  const response = await axios.get ('https://api.openai.com/v1/engines', {
    headers: {
      'Authorization': `Bearer ${process.env.openAIAuth}`,
    },
  });

  console.log (response.data);
}

listModels ().catch (console.error);
