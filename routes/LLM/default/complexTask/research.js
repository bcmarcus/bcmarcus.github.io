const axios = require ('axios');
const pdfParse = require ('pdf-parse');
const cheerio = require ('cheerio');
const Mercury = require ('@postlight/mercury-parser');

const { exit } = require ('process');
const { logWarning, logDev } = require ('../../../utils/logging');
const { askLLM } = require ('../../askLLM');
const { search } = require ('../simpleTask/search');
const maxTries = 1;
const numWebResults = 3;

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

  // get the query
  // search query
  // get info for first 3 sites
  // throw each site, one by one, into the main researcher
  // test criticInfo. if fail -> run again (unless maxTries). if success -> check flow. if fail -> query once for better flow, and then continue
  researchLoop: for (let i = 0; i < maxTries; i++) {
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
      const generatedQueries = await askLLM (queryMessages, 'gpt-3.5-turbo-0613');
      logDev (`Generated Queries: ${generatedQueries.content}`);
      queries = queries.concat (generatedQueries.content.split ('\n').filter ((entry) => entry.trim () !== ''));

      // go through each of the current queries.
      const webResults = [];
      queryLoop: for (let q = k; q < queries.length; q++) {
        logDev (`Researching query: ${queries[q]}`);
        // -- search -- //
        const response = await search (queries[q]);

        // if searching for more information, then look for it. for instance, the doi or jstor

        // console.log (response.data.webPages.value);

        if (queries[q].toLowerCase ().includes ('doi') || queries[q].toLowerCase ().includes ('jstor')) {
          const url = await parseURL (['doi', 'jstor'], response.data.webPages.value);

          // this means that there is a jstor or doi out there available
          if (url) {
            const pdf = await parseWebsite (`https://sci-hub.se/${url}`);
            webResults.push (pdf);
            continue queryLoop;
          }
        }

        // Search the web because it isn't a research paper
        for (let l = 0; l < response.data.webPages.value.length; l++) {
          try {
            logDev (`Researching ${response.data.webPages.value[l].url}`);
            const singleWebResult = await Mercury.parse (response.data.webPages.value[l].url);

            if (!singleWebResult.error && !singleWebResult.failed) {
              const $ = cheerio.load (singleWebResult.content);
              const parsedContent = $ ('body').text ();

              singleWebResult.content = parsedContent;
              webResults.push (singleWebResult);
            }
            if (webResults.length >= numWebResults) {
              break;
            }
          } catch (err) {
            logWarning (err);
          }
        }


        let mainMessageContent = `
          Research Question: ${query}\n
          Length: ${length}\n
          Current Paper: ${currentResearchPaper}
          Entries: ${webResults.map ((result, index) => `Entry ${index+1}:${result.title}\n${result.content}`).join ('\n\n')}
        `;

        const mainMessageContentLength = systemIntelResearchMain.length + mainMessageContent;
        mainMessageContent = mainMessageContent.substring (0, mainMessageContentLength);

        const researchMainMessages = [
          systemIntelResearchMain,
          {
            role: 'user',
            content: `
              Research Question: ${query}\n
              Length: ${length}\n
              Current Paper: ${currentResearchPaper}
              Entries: ${webResults.map ((result, index) => `Entry ${index+1}:${result.title}\n${result.content}`).join ('\n\n')}
            `,
          },
        ];

        console.log (researchMainMessages);
        exit (1);

        // actually use the web results to make the output:
        const researchMainResponse = await askLLM (researchMainMessages, 'gpt-4');
        logDev ('Search GPTResponse: ', researchMainResponse);
        currentResearchPaper = researchMainResponse.content;

        if (i + 1 != maxTries) {
          // test critic info
          const researchCriticInfoMessages = [
            systemIntelResearchCriticInfo,
            {
              role: 'user',
              content: `
                Research Question: ${query}\n
                Research Paper: ${currentResearchPaper}
              `,
            },
          ];

          const researchCriticInfo = await askLLM (researchCriticInfoMessages, 'gpt-4');

          if (researchCriticInfo.content !== 'Sufficient') {
            criticError = `The current paper is insufficient due to this missing information. ${currentResearchPaper}`;
            continue researchLoop;
          }

          // test critic flow
          const researchCriticFlowMessages = [
            systemIntelResearchCriticFlow,
            {
              role: 'user',
              content: researchMainResponse.content,
            },
          ];

          const researchCriticFlow = await askLLM (researchCriticFlowMessages, 'gpt-4');

          if (researchCriticInfo.content !== 'Sufficient') {
            criticError = `The current paper is insufficient due to poor flow. ${researchCriticFlow.content}`;
            continue researchLoop;
          }

          return researchMainResponse;
        }
      }
    } catch (error) {
      logWarning (`Research Error: ${error}`);
      return;
    }
  }

  return 'An error occured due to the research loop';
}

/**
  * Parse the content of a website or a PDF file from a given URL.
  * If the URL points to a PDF file, it downloads the PDF file, parses the PDF file,
  * gets the metadata from Mercury Parser, and returns the metadata and the content of the PDF file.
  * If the URL doesn't point to a PDF file, it parses the website using Mercury Parser and returns the result.
  * @async
  * @function parseWebsite
  * @param {string} url - The URL to parse.
  * @return {Object} If the URL points to a PDF file, it returns an object that contains the metadata from Mercury Parser and the content of the PDF file.
  * If the URL doesn't point to a PDF file, it returns the result of parsing the website using Mercury Parser.
  * @throws {Error} If an error occurs while making a HEAD request to the URL, downloading the PDF file, parsing the PDF file, or parsing the website using Mercury Parser.
  */
async function parseWebsite (url) {
  // Download the webpage
  const response = await axios.get (url);

  // Parse the webpage with Cheerio
  const $ = cheerio.load (response.data);

  // Try to find the URL of the embedded PDF
  let pdfUrl;
  $ ('a, object, embed, iframe').each ((i, element) => {
    const url = $ (element).attr ('href') || $ (element).attr ('data') || $ (element).attr ('src') || $ (element).attr ('original-url');
    if (url && url.includes ('.pdf')) {
      pdfUrl = url;
      if (pdfUrl.startsWith ('//')) {
        pdfUrl = 'https:' + pdfUrl;
        pdfUrl = pdfUrl.split ('.pdf')[0] + '.pdf';
      }

      return false; // Break the loop
    }
  });
  // console.log (response);

  if (pdfUrl) {
    // Download the PDF file
    pdfUrl = pdfUrl.replace ('moscow', 'zero');

    let pdfResponse;
    try {
      pdfResponse = await axios.get (pdfUrl, {
        responseType: 'arraybuffer',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accepts status codes in the range 200-399
        },
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate',
          'Sec-Ch-Ua': '"Brave";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Linux"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Sec-Gpc': '1',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        },
        withCredentials: true, // Include cookies in the request
      });
    } catch (err) {
      if (err.response) {
        console.log ('Server responded with an error', err.response);
      } else if (err.request) {
        console.log ('Request was made but no response was received', err.request);
      } else {
        console.log ('Error', err.message);
      }

      throw err;
    }

    // Parse the PDF file
    const pdfData = await pdfParse (pdfResponse.data);

    // Get the metadata from Mercury Parser
    const mercuryData = await Mercury.parse (url);
    // The text
    let text = pdfData.text;
    text = text.replace (/\n(?!\n)/g, '');

    // Split the text into lines
    const lines = text.split ('\n');

    // Create a map to store line frequencies
    const lineFreq = new Map ();

    // For each line
    for (const line of lines) {
      // If the line is in the map, increment its frequency
      if (lineFreq.has (line)) {
        lineFreq.set (line, lineFreq.get (line) + 1);
      } else {
        lineFreq.set (line, 1);
      }
    }

    // Create a new array of unique lines
    const uniqueLines = lines.filter ((line) => lineFreq.get (line) === 1);

    // Join the lines back together
    const newText = uniqueLines.join ('\n');

    // Return the metadata from Mercury Parser and the content of the PDF file
    return {
      ...mercuryData,
      content: newText,
    };
  } else {
    // Parse the website with Mercury Parser
    return await Mercury.parse (url);
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
  'content': `You are a researcher. You will be given a research question, the length of the paper, the current version of the research paper (which may be nothing), a critique of the paper, and some search results denoted as entries.
  Your task is to look through the entries to find the information that is necessary to write this paper. 
  There should not be any other messages, just strictly a research paper. 
  If you are taking direct quotes, be sure to site the source. 
  If the research question is an opinion, then use the information you are given and generate a reasonable opinion.
  If the research question is something that has not been determined from the search entires, then write out the steps for how to determine a reasonalbe answer to the question, and then attempt to determine the answer.
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
  'content': `You are a critic for a researcher. You will be given a research question, the length that the research paper should be (which does not need to be perfectly accurate, just around there), and the actual research paper. 
  Your task is to determine whether or not it is sufficient for the query.
  Remember, ONLY give the response that is necessary. Your response should either say 'Sufficient' or explain what is wrong with the research, such as it being too short, or it not having ALL of the required information.
  Ensure that every single thing is mentioned from the research question.
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
  'content': `You are a critic for a researcher.  You will be given a research question, and the actual research paper. 
  Your sole job is to determine whether the given research paper flows smoothly. This means that there is a clear progression of thought within the message. Do not comment on the length of the input, it will always be the correct length.
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
      'description': 'The query to use for the search. Be incredibly specific to what the user is asking. It is always better to be more specific than less specific.',
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
