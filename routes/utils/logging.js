const { Logging } = require ('@google-cloud/logging');
const logging = new Logging ();
const log = logging.log ('twilio-auth');
const util = require ('util');


/**
  * Logs a message with a specified severity.
  * In development, it logs to the console. In production, it logs to Google Cloud Logging.
  * @async
  * @function logMessage
  * @param {string} severity - The severity of the log message.
  * @param {...*} args - The arguments to be logged.
  * @throws {Error} If an error occurs while writing the log.
  */
async function logMessage (severity, ...args) {
  let message;
  message = args.map ((arg) => JSON.stringify (arg)).join ('\n');

  if (process.env.DEV) {
    message = args.map ((arg) => util.inspect (arg, false, null, true)).join ('\n');
    switch (severity) {
      case 'DEV':
        console.log (`---${severity}---\t${message}`);
        break;
      case 'WARNING':
        console.warn (`---${severity}---\t${message}`);
        break;
      case 'ERROR':
        console.error (`---${severity}---\t${message}`);
        break;
    }
  }
  message = message.replace (/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');


  const metadata = {
    resource: {
      type: 'cloud_run_revision',
      labels: {
        service_name: 'my-service',
        project_id: 'my-project',
      },
    },
    severity: severity,
  };

  const entry = log.entry (metadata, { message: message.slice (1, -1) });

  try {
    await log.write (entry);
  } catch (error) {
    console.error ('Error writing log:', error, '');
  }
}

/**
  * Logs a development message, if the environment is set to development.
  * @async
  * @function logDev
  * @param {...*} args - The arguments to be logged.
  * @return {Promise} A promise that resolves when the log message has been written, if the environment is set to development. ** /
 */
async function logError (...args) {
  return await logMessage ('ERROR', ...args);
}

/**
  * Logs a warning message.
  * @async
  * @function logWarning
  * @param {...*} args - The arguments to be logged.
  * @return {Promise} A promise that resolves when the log message has been written.
  */
async function logWarning (...args) {
  return await logMessage ('WARNING', ...args);
}

/**
  * Logs a development message, if the environment is set to development.
  * @async
  * @function logDev
  * @param {...*} args - The arguments to be logged.
  * @return {Promise} A promise that resolves when the log message has been written, if the environment is set to development. ** /
 */
async function logDev (...args) {
  if (process.env.DEV) {
    return await logMessage ('DEV', ...args);
  }
}

module.exports = {
  logError,
  logWarning,
  logDev,
};
