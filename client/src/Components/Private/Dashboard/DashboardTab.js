import React from 'react';

// Step 1: Define the oauth array
const oauth = [
  { url: '/path/to/gmail/endpoint', name: 'gmail' },
  { url: '/path/to/outlook/endpoint', name: 'outlook' },
  { url: '/path/to/canvas/endpoint', name: 'canvas' },
];

// Step 2: Define the getOAuthToken function
function getOAuthToken (user, type) {
  // Implement your logic here to get the OAuth token and the time remaining
  // For now, this function returns a dummy object
  return { OAuth: 'dummyOAuth', timeRemaining: 10 };
}

// Step 4: Define the function to get the indicator color
function getIndicatorColor (timeRemaining) {
  if (timeRemaining === null) return 'grey';
  if (timeRemaining < 3) return 'red';
  if (timeRemaining < 7) return 'yellow';
  return 'green';
}

function DashboardTab () {
  return (
    <div>
      {oauth.map ((oauthItem) => {
        const tokenInfo = getOAuthToken ('dummyUser', oauthItem.name);
        const indicatorColor = getIndicatorColor (tokenInfo.timeRemaining);

        return (
          <div key={oauthItem.name}>
            <button className={`bg-${indicatorColor}-500`}>{oauthItem.name}</button>
            <p>Time remaining: {tokenInfo.timeRemaining} days</p>
            <div className={`h-4 w-4 bg-${indicatorColor}-500`}></div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardTab;
