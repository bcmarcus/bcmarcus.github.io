/**
  * Executes the function with the provided arguments.
  * Logs a warning and returns if the arguments or global LLMFunctions are invalid.
  * If the validatedLLMData is valid, it sets the global systemIntel to the result of getSystemIntelTranscribe with the language value.
  * @async
  * @function execute
  * @param {Object} args - The arguments for the function.
  */
async function execute (args) {
  if (!args) {
    logWarning (`Search: Invalid args. args=${args}`);
    return;
  }

  if (!global.LLMFunctions) {
    logWarning (`Search: Invalid LLMFunctions. LLMFunctions=${global.LLMFunctions}`);
    return;
  }

  const { validatedLLMData } = args;
  if (!validatedLLMData) {
    logWarning (`Search invalid args. validatedLLMData=${validatedLLMData}`, args);
    return;
  }

  const language = validatedLLMData.parsedLLMData.language.value;

  global.systemIntel = getSystemIntelTranscribe (language);
}

const functionDetails = {
  'action': 'makeAppointment',
  'description': 'Makes an appointment at an establishment at a given time.',
  'requiredParams': {
    'businessName': {
      'type': 'string',
      'description': 'The specific name of the establishment. Do not input a generic name, such as "dentist", unless allowed by the user.',
    },
    'type': {
      'type': 'string',
      'description': 'The specific type of appointment as specified by the user to be made. Do not guess what the user wants their appointment to be for.',
    },
    'date': {
      'type': 'string',
      'description': 'The date and the time of day that it should be scheduled for',
    },
    'specialRequirements': {
      'type': 'string',
      'description': 'Any special requirements that the user wants. If none exist, put "None"',
    },
    'phoneNumber': {
      'type': 'string',
      'description': 'The phone number of the establishment.',
    },
    'requiresLocation': {
      'type': 'boolean',
      'description': 'Whether or not the query requires a location to complete the search',
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
  'example': `Example input: User: Make an appointment at the Duvall Eye Care for a regular eye checkup for june 3rd at 2.
  Secretary: Proceed to functions: Making an appointment at Duvall Eye Care for a regular eye checkup on June 3rd at 2.

  Example output: 'action: makeAppointment, businessName: Duvall Eye Care, type: regular eye checkup, date: June 3rd, at 2:00 PM, phoneNumber: Searchable, requiresLocation: false'`,
};


module.exports = {
  functionDetails,
  execute,
};
