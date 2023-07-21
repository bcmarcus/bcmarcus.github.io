# Base Firebase and React App: Setup Guide

This guide provides step-by-step instructions for setting up the Base Firebase and React app. It's divided into two sections:

1. **Slow Start**: Detailed instructions for first-time setup.
2. **Fast Start**: Quick reference for subsequent setups.

## 1. Slow Start

Your project incorporates three essential components: npm, Firebase, and React. This section provides a comprehensive setup process for each, starting with Git configuration.

### 1.1 Git Configuration

The initial step involves configuring your Git environment. Ensure the `.git/config` file contains your correct information. If it doesn't, run the following commands in your terminal to update it:

```
git config --global user.name "Your Name"
git config --global user.email you@example.com
git init
git branch -m master
git remote add origin https://github.com/user/repo.git
git checkout -b your-branch-name
```

If a remote has already been set, use the following command instead:
```
git remote set-url origin https://github.com/user/repo.git
```

### 1.2 npm (Node Package Manager)

npm is responsible for managing external packages and running the website locally. First, we need to install npm and Node.js. Here are the installation instructions for various operating systems:

Windows powershell install node and npm:
```
Set-ExecutionPolicy AllSigned -Scope Process
iex (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
scoop install nodejs
```

MacOS terminal install node and npm:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

Linux terminal install node and npm:
```
sudo apt update
sudo apt install nodejs npm
```

Change your directory into the project directory ("Base-Firebase-React-Site"), install the dependencies with `npm install`, and then start hosting the website locally with `npm start`.

### 1.3 Firebase

Firebase handles server-side operations. This includes managing the API, database, user authentication, and web hosting. To utilize Firebase, we need to perform several setup steps:

#### 1.3.1 Creating a Firebase Project

Sign into Firebase and create a new project. Follow the instructions provided, then link your Firebase website to the internet by copying and pasting the provided config into the `firebaseConfig.js` file.
Then, begin with `firebase init` in the terminal. For database, follow the instructions. For functions, say **Overwrite**, then **Javascript**, then **No** 4 times, then **Yes** when it asks to install dependencies, then use **dist** as the public directory, and **N** for the last questions.

#### 1.3.2 Firebase Database

The `database.rules.json` file may need to be modified depending on your needs. More information can be found in the Firebase Database documentation.

#### 1.3.3 Firebase Authentication

Enable OAuth for the specific providers you wish to use in the Firebase dashboard. Examples can be found in the `login.js` file and the `firebaseConfig.js` file.

For Apple, follow these steps [Apple Firebase Auth Setup](https://firebase.google.com/docs/auth/web/apple)

#### 1.3.4 Firebase Hosting

Firebase allows you to host the front end online through a Firebase website. Using `firebase deploy` pushes your website to production.
If you dont want to run `npm run build` each time, add these lines of code into firebase.json in the hosting object.
```"predeploy": [
  "rm -rf dist && npm run build"
],```

#### 1.3.5 Firebase Functions

Firebase Functions let you host an API back end. To upload functions, call `firebase deploy --only functions` in the console. Note: You may have to change into the functions folder and the `config.js` file needs to be properly configured.

#### 1.3.6 Adding Additional Firebase Features

To add other Firebase features, modify the `firebaseConfig.js` file to include imports, constants, and exports corresponding to the new features.
Furthermore, add your project name in `.firebaserc` and `package.json` if it has not already auto-populated.

#### 1.3.7 Secret Management

Google Secrets Manager is used for managing secrets securely. To set it up, go to the [Google Console](https://console.cloud.google.com/) and type "Secret Manager." Enable API Access
Then, go to the IAM Admin portal and find the Service Account with an email of [projectID]@appspot.gserviceaccount.com and with a name of App Engine default service account.
To this, add these two roles: **Secret Manager Secret Accessor** and **Secret Manager Viewer**.
Add your secrets in the manager, and then go to `functions/config.js` and put in the details.

### 1.4 React

React is responsible for front-end functionality and presentation. It's structured into reusable components, which are easy to manage and update.

### 1.5 Docker

docker login

nano ~/.bashrc OR nano ~/.zshrc
// add this
export CALL_TO_ACTION_ID=your_value
// exit the terminal
// this applies changes
source ~/.bashrc


```
gcloud init (if it hasnt been made already)
gcloud auth login
gcloud config set project PROJECT_ID
gcloud services enable artifactregistry.googleapis.com
gcloud artifacts repositories create api --repository-format=docker --location=us-central1 --description="API Repository"
gcloud auth configure-docker us-central1-docker.pkg.dev
gcloud components install docker-credential-gcr
```

gcloud builds submit --tag us-central1-docker.pkg.dev/my-project-id/my-repository/my-image


`gcloud builds submit --tag us-central1-docker.pkg.dev/api`
This command builds your Docker image and pushes it to Google Container Registry, using Google Cloud Build. codelabs.developers.google.com

$GCP_KEY_PATH is an environment variable set on your local machine that points to the location of your service account key file. When you start your service, you'll need to set this environment variable:

｀export GCP_KEY_PATH=~/keys/project-key.json｀
｀docker-compose -f docker-compose.yml -f docker-compose.access.yml up｀

### 1.6 Final Checks
Ran npm install
Changed /src/firebaseConfig.js
Changed /functions/config.js
Added more providers in FirebaseContexts if necessary
Made a firebase project and added secrets to it
Ran Firebase init with "Use existing project"


## 2. Fast Start

The Fast Start section is intended for those already familiar with the setup process. Here, you'll find the necessary commands to start hosting the website locally, run it in production, and initialize specific Firebase features.

In the project directory, run `npm start` to host the website locally, or `firebase deploy` to run it in production. 

To push functions to the server, run `firebase deploy --only functions`

To initialize a specific Firebase feature, run 'firebase init [feature]'. Valid features are:

  - database
  - emulators
  - firestore
  - functions
  - hosting
  - hosting:github
  - remoteconfig
  - storage

For more detailed instructions, refer to Firebase and npm's respective official documentation.