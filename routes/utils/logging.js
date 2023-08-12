const {Logging} = require('@google-cloud/logging');
const logging = new Logging();
const log = logging.log('twilio-auth');
const util = require('util');

async function logMessage(severity, ...args) {
  let message;
  if (process.env.DEV) {
    message = args.map(arg => util.inspect(arg, false, null, true)).join('\n');
  } else {
    message = args.map(arg => JSON.stringify(arg)).join('');
  }

  const metadata = {
    resource: {
      type: 'cloud_run_revision', 
      labels: {
        service_name: 'my-service', 
        project_id: 'my-project'
      }
    },
    severity: severity,
  };

  const entry = log.entry(metadata, {message: message});

  try {
    await log.write(entry);
    if (process.env.DEV) {
      console.log(`---${severity}---\t`, message, "");
    }
  } catch (error) {
    console.error('Error writing log:', error, "");
  }
}

async function logWarning(...args) {
  return logMessage('WARNING', ...args);
}

async function logDebug(...args) {
  if (process.env.DEBUG) {
    return logMessage('DEBUG', ...args);
  }
}

module.exports = {
  logWarning,
  logDebug
};
