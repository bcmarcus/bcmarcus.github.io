

/**
  * Executes the function and logs a message.
  * @async
  * @function execute
  * @return {string} A string indicating the task completion.
  */
async function execute () {
  console.log ('Inside order food execute!');
  return 'Task Complete';
}

/**
  * Details about the search function, including its action, description, required parameters, and an example.
  * @constant
  * @type {Object}
  */
const functionDetails = {
  'action': 'orderFood', // should be the same as the file name
  'description': 'Orders food by calling a restaurant. All parameters need to be known.',
  'requiredParams': {
    'restaurant': {
      'type': 'string',
      'description': 'The restaurant that is requested',
    },
    'address': {
      'type': 'string',
      'description': 'The address of the restaurant. This can also be searched using other actions, such as search',
    },
    'phoneNumber': {
      'type': 'string',
      'description': 'The phone number of the restaurant',
    },
    'request': {
      'type': 'string',
      'description': 'The name of the meal, and any special requirements for the meal.',
    },
    'time': {
      'type': 'string',
      'description': 'The time that the food meal should be ready, either now, or later at a specific time',
    },
    'requiresDelivery': {
      'type': 'boolean',
      'description': 'Whether or not the food should be delivered',
      'anyIfTrue': {
        'myAddress': {
          'type': 'string',
          'description': '"Current Location", "Work", and "Home", or A complete address, formatted as unit (if applicable), street, city, state, zip code. An example is "Microsoft Building 9, 1 Microsoft Way, Redmond, WA, 98052."',
        },
      },
    },
  },
  'example': `Example input: User: Can you order me a pepperoni and sausage pizza from dominos? Have it delivered to my work.
  Secretary: Question: When would you like it delivered?.
  User: Now.
  Secretary: Proceed to functions. 

  Example output: 'action: makeAppointment, restaurant: Dominos, address: date: June 3rd, at 2:00 PM, phoneNumber: Searchable, requiresDelivery: true, myAddress: Home'
  `,
};

module.exports = {
  functionDetails,
  execute,
};
