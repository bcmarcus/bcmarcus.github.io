const axios = require ('axios');
const Mercury = require ('@postlight/mercury-parser');

const { exit } = require ('process');
const { logWarning, logDev } = require ('../../../utils/logging');
const { askGPT } = require ('../../GPT/askGPT');
const { search } = require ('../simpleTask/search');
const maxTries = 1;

/**
  * Executes research based on provided arguments and logs warnings for invalid arguments.
  * @async
  * @function execute
  * @param {Object} args - The arguments for the research.
  * @throws {Error} If an error occurs during the research.
  */
async function execute (args) {
  if (!args) {
    logWarning (`Search: Invalid args, expected query to be set. args=${args}`);
    return;
  }

  const { query, length } = args;
  let queries = [];

  const researchMainMessages = [
    systemIntelResearchMain,
    {
      role: 'user',
      content: '',
    },
  ];

  const criticInfoMessages = [
    systemIntelResearchCriticInfo,
    {
      role: 'user',
      content: '',
    },
  ];

  const criticFlow = [
    systemIntelResearchCriticFlow,
    {
      role: 'user',
      content: '',
    },
  ];

  // get the query
  // search query
  // get info for first 3 sites
  // throw each site, one by one, into the main researcher
  // test criticInfo. if fail -> run again (unless maxTries). if success -> check flow. if fail -> query once for better flow, and then continue
  for (let i = 0; i < maxTries; i++) {
    try {
      // -- get the necessary query -- //
      const k = queries.length;
      const queryMessages = [
        systemIntelResearchQuery,
        {
          role: 'user',
          content: `Research Question: ${query.value}, Already Searched Queries: ${queries}`,
        },
      ];
      const generatedQueries = await askGPT (queryMessages, 'gpt-3.5-turbo-0613');
      logDev (`Generated Queries: ${generatedQueries.content}`);
      queries = queries.concat (generatedQueries.content.split ('\n'));

      // go through each of the current queries.
      for (let q = k; q < queries.length; q++) {
        // -- search -- //
        const response = await search (queries[q]);

        // if searching for more information, then look for it. for instance, the doi or jstor

        // console.log (response.data.webPages.value);

        if (queries[q].toLowerCase ().includes ('doi') || queries[q].toLowerCase ().includes ('jstor')) {
          const url = await parseURL (['doi', 'jstor'], response.data.webPages.value);
          console.log (url);

          // this means that there is a jstor or doi out there available
          if (url) {
            parseWebsite (url);
          }
        }

        //
        webResult = [];
        parseWebsite (response.data.webPages.value[0].url);
        await webResult.push (await Mercury.parse (response.data.webPages.value[0].url));
        await webResult.push (await Mercury.parse (response.data.webPages.value[1].url));
        await webResult.push (await Mercury.parse (response.data.webPages.value[2].url));

        console.log ('here', webResult);
        exit (1);

        const researchMainMessages = [
          systemIntelResearchMain,
          {
            role: 'user',
            content: '',
          },
        ];

        snippets = [];

        if (response.data && response.data.webPages && response.data.webPages.value.length != 0) {
          for (let j = 0; j < response.data.webPages.value.length; j++) {
            if (response.data.webPages.value[j].snippet) {
              snippets.push (response.data.webPages.value[j].snippet);
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
      }
    } catch (error) {
      logWarning ('Research Error: ', error.message);
      return;
    }
  }
}

/**
  * Parses a list of URLs and returns the first URL whose domain contains any of the provided keywords.
  * The comparison is case-insensitive.
  * @async
  * @function parseURL
  * @param {Array.<string>} keywords - The keywords to search for in the domain of the URLs.
  * @param {Array.<Object>} webPages - The web pages to parse. Each object should have a 'url' property.
  * @return {string|null} The first URL whose domain contains any of the keywords, or null if no such URL is found.
  * @throws {Error} If an error occurs while parsing the URLs.
  */
async function parseURL (keywords, webPages) {
  // Iterate over the web pages
  for (const page of webPages) {
    // Create a URL object
    const urlObj = new URL (page.url);

    // Convert the domain to lowercase for case-insensitive comparison
    const domain = urlObj.hostname.toLowerCase ();

    // Check if the domain contains any of the keywords
    for (const keyword of keywords) {
      if (domain.includes (keyword.toLowerCase ())) {
        // If a match is found, return the URL
        return page.url;
      }
    }
  }

  // If no match is found, return null or an appropriate message
  return null;
}


/**
  * A default message for the system to use during a search.
  * @constant
  * @type {Object}
  */
const systemIntelResearchMain = {
  'role': 'system',
  'content': `You are a hyper precise summarizer. Your task, given a research question and search results, is to look through the results and pick out just the information that is necessary. 
  There should not be any other messages, just strictly the answer. Furthermore, if you are taking direct quotes, be sure to site the source. 
  If the research question is an opinion, then use the information you are given and generate a reasonable opinion.
  If the research question is something that has not been determined from the internet, then write out the steps for how to determine a reasonalbe answer to the question, and then attempt to determine the answer.
  If the research question is none of the above, then simply write a compelling argument based around the research question.
  `,
};

/**
  * A default message for the system to use for critiquing.
  * @constant
  * @type {Object}
  */
const systemIntelResearchCriticInfo = {
  'role': 'system',
  'content': `You are a critic for a researcher. You will be given a search query and the length of the report, and you will determine whether or not it is sufficient for the query.
  Remember, ONLY give the response that is necessary. Your response should either say 'Sufficient' or explain what is wrong with the research, such as it being too short, or it not having ALL of the required information.
  Ensure that every single thing is mentioned from the research query.
  If the research question is about a complex topic, but asks for a simple explanation, then research it as if it was complex, and it will later be rewritten in a simple manner elsewhere.
`,
};

/**
  * A default message for the system to use for critiquing the flow of the output.
  * @constant
  * @type {Object}
  */
const systemIntelResearchCriticFlow = {
  'role': 'system',
  'content': `You are a critic for a researcher. Your sole job is to determine whether the given research paper flows smoothly. This means that there is a clear progression of thought within the message. Do not comment on the length of the input, it will always be the correct length.
  Your response should either say 'Sufficient' or explain what is wrong with the input, such as it being too clunky, or not having a satisfying conclusion. Ensure that you write out EVERY single thing that is wrong with the flow. 
  Again, if nothing is wrong and the flow seems good for the given research paper, then respond with just 'Sufficient' and nothing else.
`,
};

/**
  * A default message for the system to use for critiquing.
  * @constant
  * @type {Object}
  */
const systemIntelResearchQuery = {
  'role': 'system',
  'content': `You are an assistant for a researcher. You will be given a research question and queries that have already been researched. Determine what kinds of questions are necessary given the research question. 
  If there is a research question about a specific research paper, then look up the doi or the jstor as the first query.
  Your response should either say 'Sufficient' or explain what is what further queries are necessary. This can be because there have not been enough researched, or perhaps there is more crucial information that should be added, that the research question did not address.
  If every query provided is enough to research the initial research question, then simply respond with 'Sufficient' and nothing else. Do not add extra bloat queries that may not be necessary.
  If the research question is about a complex topic, but asks for a simple explanation, then continue to make complex queries, and it will later be rewritten in a simple manner elsewhere.

  An examples of your task are shown below:
  Example 1 input: {
    Research Question: "Write a 1000 word paper on The Structure of Thinking and Technology by Henryk Skolimowski"
    Already Searched Queries: []
  }
  Example 1 output: 'The Structure of Thinking and Technology" by Henryk Skolimowski DOI or JSTOR\n'
  'Summary of "The Structure of Thinking and Technology" by Henryk Skolimowski\n'
  'Key concepts in "The Structure of Thinking and Technology" by Henryk Skolimowski\n'
  'Critiques of "The Structure of Thinking and Technology" by Henryk Skolimowski\n'
  'Impact of "The Structure of Thinking and Technology" by Henryk Skolimowski on the field of technology studies\n'
`,
};

/**
  * Details about the search function, including its action, description, required parameters, and an example.
  * @constant
  * @type {Object}
  */
const functionDetails = {
  'action': 'research',
  'description': 'Researches a subject. This can be something complex, or something simple.',
  'requiredParams': {
    'query': {
      'type': 'string',
      'description': 'The query to use for the search. It is better to be more specific than less specific.',
    },
    'length': {
      'type': 'string',
      'description': 'The length of the report',
    },
  },
  'example': `Example input: 
  'User: Research how and what quaternions are used for. Also, provide some detail on why they are used over regular 3d coordinates.
  Secretary: Question: How long would you like this to be?
  User: About a page
  Secretary: Proceed to functions: Researching quaternions'

  Example output: 'action: research, query: Research how and what quaternions are used for. Also, provide some detail on why they are used over regular 3d coordinates, length: a page'`,
};

module.exports = {
  functionDetails,
  execute,
};
