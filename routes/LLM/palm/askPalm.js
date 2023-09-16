const axios = require ('axios');

async function askPALM (messages, model='default', temperature=0.2) {
  const options = await preparePALM (messages, model, temperature); // Prepare the options

  if (!options ||
      Object.keys (options).filter ((key) => key !== 'functions').some ((key) => options[key] === undefined)) {
    logWarning ('Improper values passed into askPALM: ', options);
    return;
  }

  const apiKey = process.env.googlePALMAuth; // Retrieve the API key

  if (!apiKey) {
    logWarning ('Failed to retrieve Google PALM key from Secret Manager');
    throw new Error ('Failed to retrieve Google PALM key from Secret Manager');
  }

  try {
    const response = await axios.post (
        'https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/predictions/${modelId}:predict', { ...options },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
    );

    return response.data; // Return the response
  } catch (err) {
    await logWarning (err.message);
    throw new Error ('Failed to call Google PALM API');
  }
}


