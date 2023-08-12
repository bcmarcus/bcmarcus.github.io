

async function execute (args) {
  const { brandName, address, phoneNumber, type, time } = args;
  if (!brandName || !address || !phoneNumber || !type || !time) {
    logWarning("MakeAppointment: Invalid args, expected query to be set.", args);
    return;
  }
  logDebug("MakeAppointment Brand Name: ", brandName);
  logDebug("MakeAppointment Address: ", address);
  logDebug("MakeAppointment Phone Number: ", phoneNumber);
  logDebug("MakeAppointment Type: ", type);
  logDebug("MakeAppointment Time: ", time);
  return "Task Complete";
}

const functionDetails = {
  "name": "makeAppointment",
  "description": "Makes an appointment at an establishment, by providing the brand name of the establishment, the appointment type, and the time to set the appointment. Ensure all three of these are known before proceeding",
  "parameters": {
    "type": "object",
    "properties": {
      "brandName": {
        "type": "string",
        "description": "The specific brand name of the establishment. Do not input a generic name. Include an address to the specific location as well."
      },
      "address": {
				"type": "string",
				"description": "The address of the restaurant"
			},
			"phoneNumber": {
				"type": "string",
				"description": "The phone number of the restaurant"
			},
      "type": {
        "type": "string",
        "description": "The specific type of appointment as specified by the user to be made. Do not guess what the user wants for this parameter."
      },
      "time": {
        "type": "string",
        "description": "The day, date, and the time of day that it should be scheduled for"
      },
      "delivered": {
        "type": "boolean",
        "description": "Whether or not the food should be delivered to them"
      },
      "deliverLocation": {
        "type": "string",
        "description": "The address that the food should be brought to. [Home], [Work], and [Current Location] are also valid addresses."
      }
    },
    "required": ["brandName", "address", "phone-number", "type", "time", "delivered"]
  }
};

module.exports = {
  functionDetails,
  execute
}