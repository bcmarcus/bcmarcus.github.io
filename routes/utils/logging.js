const {Logging} = require('@google-cloud/logging');
const logging = new Logging();
const log = logging.log('twilio-auth');

async function logWarning(...args) {
  const message = args.map(arg => JSON.stringify(arg)).join(', ');

  const metadata = {
    resource: {
      type: 'cloud_run_revision', 
      labels: {
        service_name: 'my-service', 
        project_id: 'my-project'
      }
    },
    severity: 'WARNING',
  };

  const entry = log.entry(metadata, {message: message});

  try {
    await log.write(entry);
    console.log(`Logged: ${entry.data.message}`);
  } catch (error) {
    console.error('Error writing log:', error);
  }
}


module.exports = logWarning;