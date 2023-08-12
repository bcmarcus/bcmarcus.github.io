const axios = require('axios');

const { logWarning, logDebug } = require('../../../utils/logging');
const askGPT = require('../../askGPT');

defaultSystemIntelBingSearch = {
  "role": "system",
  "content": `You are a hyper precise summarizer. Your task, given a query and results, is to look through the results and pick out just the information that is necessary. There should not be any other messages, just strictly the answer.
  The messages will come in this form:
  {
    query: [Actual query]
    results:
      [
        [Result 1]
        [Result 2]
        ...
      ]
  }
  Two examples of your task are shown below:
  Example 1 input: {
    query: "circumference of the sun"
    results:
      [
        "The Sun's radius is about 695,000 kilometers (432,000 miles), or 109 times that of Earth. Its mass is about 330,000 times that of Earth, comprising about 99.86% of the total mass of the Solar System. [20]"
        "The Sun is about 93 million miles (150 million kilometers) from Earth, and without its energy, life as we know it could not exist here on our home planet. The Latest New NASA Map Details 2023 and 2024 Solar Eclipses in the US The Sun is the largest object in our solar system. The Sun’s volume would need 1.3 million Earths to fill it."
        "The sun's circumference is about 2,715,396 miles (4,370,006 km). It may be the biggest thing in this neighborhood, but the sun is just average compared to other stars. Betelgeuse, a red..."
      ]
  }
  Example 1 output: Info: 2,715,396 miles

  Example 2 input: {
    query: "Apple headquarters HQ"
    results:
      [
        "Apple Park is the corporate headquarters of Apple Inc., located in Cupertino, California, United States. It was opened to employees in April 2017, while construction was still underway, and superseded Apple Infinite Loop as the company's corporate headquarters, which opened in 1993. [7]"
        "Apple is headquartered in Cupertino, CA and has 37 office and retail locations located throughout the US. See if Apple is hiring near you. All Corporate Offices Retail Locations Corporate Offices Retail Locations Cupertino, CA 996-1010 Address Apple Inc One Apple Park Way Cupertino, CA 95014 United States"
      ]
  }
  Example 2 output: Address: One Apple Park Way; Cupertino, CA 95014, U.S.A.

  Remember, ONLY give the response that is necessary.
  The only responses that I want you to return are: Business name, phone number, address, unkonwn, or a synopsis of the information. Only give a synopsis if the query asks for one.
  If there are multiple answers, choose one that seems to fit best. Only provide one entry per response. In other words, do not respond with two business names, or two phone numbers etc..
  Structure the data like this: "Business Name: [The actual name], Phone Number: [The actual phone number],...". Do not include descriptors if the information is unknown. For instance, if the phone number is unknown, then do not put it in the response.
  Make sure the phone number is structured like this 123-456-7890.
`};

async function execute (args) {
  const { query } = args;
  if (!query) {
    logWarning("BingSearch: Invalid args, expected query to be set.", args);
    return;
  }
  logDebug("BingSearch Query: ", query);


  try {
    let subscriptionKey = '3ba221833ed541d783191b24453cc687';
    let url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}`;

    let response = await axios.get(url, {
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
    });

    snippets = [];

    if (response.data && response.data.webPages && response.data.webPages.value.length != 0) {
      for (var i = 0; i < response.data.webPages.value.length; i++) {
        // console.log(response.data.webPages.value[i].snippet);
        if (response.data.webPages.value[i].snippet) {
          snippets.push(response.data.webPages.value[i].snippet);
        }
      }
    } else {
      return;
    }

    messages = [
      defaultSystemIntelBingSearch, 
      {
        "role": "user",
        "content": `query: ${query} \n results: ${JSON.stringify(snippets)}`
      }
    ];
    logDebug("BingSearch Messages: ", messages);
    let gptResponse = await askGPT(messages, "gpt-4-0613");
    logDebug("BingSearch GPTResponse: ", gptResponse);
    return gptResponse;
  } catch (error) {
    logWarning ("BingSearch Error: ", error.message);
  }
}


const functionDetails = {
  "name": "bingSearch",
  "description": "Looks up something on the internet through bing search. Can only be used if the answer is completely unknown.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The query to use for the search"
      }
    },
    "required": ["query"]
  }
};

module.exports = {
  functionDetails,
  execute
}