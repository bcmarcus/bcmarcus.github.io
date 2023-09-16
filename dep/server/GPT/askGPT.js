const { OpenAIApi, Configuration } = require('openai');
// -- THIS CODE GETS ALL OF THE MODULES FROM A SPECIFIC DIRECTORY, AND INCLUDES THEM ALL. THESE ARE NOW PART OF THE MODULES OBJECT -- //

const fs = require('fs');
const path = require('path');

// const model = "gpt-3.5-turbo-0613";
// const model = "gpt-4-0613";

async function askGPT(messages, model="gpt-3.5-turbo-0613", callFunctions="none", functions = undefined) {
  
  let apiKey;
  try {
    apiKey = global.openAIAuth;
  } catch (err) {
    throw new Error("Failed to retrieve key from Secret Manager");
  }

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  if (!messages) {
    logWarning ("Bad call to askGPT.");
    return "";
  }

  // console.log(messages);
  // console.log(model);
  // console.log(functions);
  // console.log(callFunctions);
  let response;
  try {
    var options = {
      model,
      messages,
      max_tokens: 500
    }
    if (functions) {
      options.functions = functions;
      options.function_call = callFunctions;
    } 
    
    response = await openai.createChatCompletion(options);

  } catch (err) {
    await logWarning(err.message);
    throw new Error("Failed to call OpenAI API");
  }

  return response.data.choices[0].message;
}

module.exports = askGPT;

// // Usage
// const dirPath = path.join(__dirname, '/your-directory-name');
// const modules = loadModules(dirPath);

// // Now you can access your modules like this:
// // modules.call.functionDetails
// // modules.call.execute()

// // To get all the module names
// const moduleNames = Object.keys(modules);
// console.log(moduleNames);

// // To iterate over all modules and call `execute()`
// for (let moduleName of moduleNames) {
//     const module = modules[moduleName];
//     module.execute();
// }








// -- THIS CODE GETS A SINGLE FUNCTION FROM FIRESTORE (metadata) AND FIREBASE STORAGE (actual file) -- //

// const admin = require('firebase-admin');
// const fs = require('fs');
// const path = require('path');

// // Assuming you already have firebase admin initialized & authenticated
// let bucket = admin.storage().bucket();
// let firestore = admin.firestore();

// let fileName = "your-filename.js"; // replace with your file name
// let destination = path.join(__dirname, fileName); // replace with your local path

// // Function to get file metadata from Firestore
// const getFileMetadata = async (fileName) => {
//   try {
//     const docSnapshot = await firestore.collection('fileMetadata').doc(fileName).get();
    
//     if (!docSnapshot.exists) {
//       console.log(`No metadata found for file: ${fileName}`);
//       return null;
//     } else {
//       console.log('File data:', docSnapshot.data());
//       return docSnapshot.data();
//     }
//   } catch (err) {
//     console.error('Error getting document:', err);
//   }
// };

// // Check if file already exists
// if (fs.existsSync(destination)) {
//   // If it does, get metadata, require and run it
//   getFileMetadata(fileName).then(() => {
//     const func = require(destination);
//     func();
//   });
// } else {
//   // If it doesn't, download it
//   bucket.file(fileName).download({ destination })
//     .then(() => {
//       console.log(`${fileName} downloaded.`);

//       // Get metadata
//       return getFileMetadata(fileName);
//     })
//     .then(() => {
//       // Require and run the downloaded file
//       const func = require(destination);
//       func();
//     })
//     .catch(err => {
//       console.error('ERROR:', err);
//     });
// }

// // Later, when you want to update the file:

// // Delete the file from the cache
// delete require.cache[require.resolve(destination)];

// // Delete the file from the filesystem
// fs.unlink(destination, err => {
//   if (err) throw err;
//   console.log(`${fileName} was deleted.`);
// });

