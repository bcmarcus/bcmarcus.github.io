

async function execute () {
	console.log("Inside order food execute!");
	return "Task Complete";
}

const functionDetails = {
	"name": "orderFood", // should be the same as the file name
	"description": "Orders food by calling a restaurant. All parameters need to be known.",
	"parameters": {
		"type": "object",
		"properties": {
			"restaurant": {
				"type": "string",
				"description": "The restaurant that is requested"
			},
			"address": {
				"type": "string",
				"description": "The address of the restaurant"
			},
			"phoneNumber": {
				"type": "string",
				"description": "The phone number of the restaurant"
			},
			"request": {
				"type": "string",
				"description": "The name of the meal, and any other specifications if they exist such as toppings, or removal of certain items"
			},
			"time": {
				"type": "string",
				"description": "The time that the food meal should be ready, either now, or later at a specific time and day"
			}
		},
		"required": ["restaurant", "address", "phone-number", "request", "time"]
	}
};

module.exports = {
  functionDetails,
  execute
}