# Local
Make twilio phone number

run "ngrok http 3000"

Go to it and next to "A call comes in" select Webhook, and for the URL, use the ngrok one (or the real one if you have a real server)

In the code, change AIvoiceMessageUrl to have the ngrok path at the start

run 'node Call.js' or deploy it to firebase

Profit


# Google Cloud Run with Docker

｀gcloud builds submit --tag gcr.io/$CALL_TO_ACTION_ID/express-app｀
Replace $GOOGLE_CLOUD_PROJECT with your Google Cloud project ID. This command builds your Docker image and pushes it to Google Container Registry, using Google Cloud Build. codelabs.developers.google.com

$GCP_KEY_PATH is an environment variable set on your local machine that points to the location of your service account key file. When you start your service, you'll need to set this environment variable:

｀export GCP_KEY_PATH=~/keys/project-key.json｀
｀docker-compose -f docker-compose.yml -f docker-compose.access.yml up｀
