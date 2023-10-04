const axios = require ('axios');

const { logWarning, logDev } = require ('../../../utils/logging');
const { askLLM } = require ('../../askLLM');

/**
  * Executes a search based on provided arguments and logs warnings for invalid arguments.
  * @async
  * @function execute
  * @param {Object} args - The arguments for the search.
  * @throws {Error} If an error occurs during the search.
  */
async function execute (args) {
  if (!args) {
    logWarning (`Search: Invalid args, expected query to be set. args=${args}`);
    return;
  }

  let { query } = args;
  query = query.value;

  try {
    const response = await search (query);

    snippets = [];

    if (response.data && response.data.webPages && response.data.webPages.value.length != 0) {
      for (let i = 0; i < response.data.webPages.value.length; i++) {
        if (response.data.webPages.value[i].snippet) {
          snippets.push (response.data.webPages.value[i].snippet);
        }
      }
    } else {
      return;
    }

    messages = [
      defaultSystemIntelSearch,
      {
        'role': 'user',
        'content': `query: ${query} \n results: ${JSON.stringify (snippets)}`,
      },
    ];

    logDev (`Search query: ${query}`);
    const gptResponse = await askGPT (messages, 'gpt-4-0613');
    logDev ('Search GPTResponse: ', gptResponse);
    return gptResponse.content;
  } catch (error) {
    logWarning ('Search Error: ', error.message);
    return;
  }
}

/**
  * Performs a search using the Bing Search API.
  * @async
  * @function search
  * @param {string} query - The query to use for the search.
  * @return {Object} The response from the Bing Search API.
  */
async function search (query) {
  const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent (query)}`;

  const response = await axios.get (url, {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.bingAuth,
    },
  });

  return response;
}


/**
  * A default message for the system to use during a search.
  * @constant
  * @type {Object}
  */
const defaultSystemIntelSearch = {
  'role': 'system',
  'content': `You are a hyper precise summarizer. Your task, given a query and results, is to look through the results and pick out just the information that is necessary. There should not be any other messages, just strictly the answer.
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
        
        "The Sun is about 93 million miles (150 million kilometers) from Earth, and without its energy, life as we know it could not exist here on our home planet. 
        The Latest New NASA Map Details 2023 and 2024 Solar Eclipses in the US The Sun is the largest object in our solar system. The Sun’s volume would need 1.3 million Earths to fill it."

        "The sun's circumference is about 2,715,396 miles (4,370,006 km). It may be the biggest thing in this neighborhood, but the sun is just average compared to other stars. Betelgeuse, a red..."
      ]
  }
  Example 1 output: The circumference of the sun is 2,715,396 miles.

  Example 2 input: {
    query: "Apple headquarters address"
    results:
      [
        "Apple Park is the corporate headquarters of Apple Inc., located in Cupertino, California, United States. 
        It was opened to employees in April 2017, while construction was still underway, and superseded Apple Infinite Loop as the company's corporate headquarters, which opened in 1993. [7]"

        "Apple is headquartered in Cupertino, CA and has 37 office and retail locations located throughout the US. See if Apple is hiring near you. 
        All Corporate Offices Retail Locations Corporate Offices Retail Locations Cupertino, CA 996-1010 Address Apple Inc One Apple Park Way Cupertino, CA 95014 United States"
      ]
  }
  Example 2 output: The address of Apple's headquarters is One Apple Park Way; Cupertino, CA 95014, U.S.A.

  Remember, ONLY give the response that is necessary. Your response should be only one sentence.
  If there are multiple answers, choose one that seems to fit best.
` };

/**
  * Details about the search function, including its action, description, required parameters, and an example.
  * @constant
  * @type {Object}
  */
const functionDetails = {
  'action': 'search',
  'description': 'Looks up something on the internet. Can only be used if the answer is completely unknown. This can be used to look up facts and statistics as well.',
  'requiredParams': {
    'query': {
      'type': 'string',
      'description': 'The query to use for the search. It is better to be more specific than less specific.',
    },
    'requiresLocation': {
      'type': 'boolean',
      'description': 'Whether or not the query requires a location to complete the search. For instance, if there is a chain restaurant with two stores, it is important to know which one the user is referencing.',
      'anyIfTrue': {
        'location': {
          'type': 'string',
          'description': 'The actual location. This MUST be a proper noun, such as "Seattle", or one of the following: "Current Location", "Work", and "Home".',
        },
        'address': {
          'type': 'string',
          'description': 'A complete address, formatted as unit (if applicable), street, city, state, zip code. An example is "Microsoft Building 9, 1 Microsoft Way, Redmond, WA, 98052."',
        },
      },
    },
  },
  'example': `Example input: 
  'User: What is the closest in n out to my college?
  Secretary: Question: Can you please provide me with the name of your college?
  User: UCR
  Secretary: Proceed to functions: Searching for the closest in n out to UCR'

  Example output: 'action: search, query: closest in n out to UCR, requiresLocation: true, location: UCR, address: Unknown'`,
};

module.exports = {
  functionDetails,
  search,
  execute,
};
