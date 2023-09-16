// test getSecret
const getSecret = require ('../secrets'); // Assuming getSecret is exported from a module

describe ('getSecret', () => {
  it ('correct value', async () => {
    const result = await getSecret ('test');
    expect (result).toBe ('testValue1234567890qwertyuiopasdfghjklzxcvbnm');
  });
});


// test authorizeTwilio
const authorizeTwilio = require ('../twilioAuth'); // replace with your actual file path
const twilio = require ('twilio');

jest.mock ('twilio', () => ({
  validateRequest: jest.fn (),
}));

describe ('authorizeTwilio', () => {
  let req;
  let res;
  let next;
  let twilioAuth;

  beforeEach (() => {
    req = {
      headers: {},
      body: {},
      originalUrl: '/test',
    };
    res = {
      status: jest.fn ().mockReturnThis (),
      send: jest.fn (),
    };
    next = jest.fn ();
    twilioAuth = 'testAuth';
    twilioSignature = 'testSignature';
    url = 'http://test.com/test';
    process.env.twilioAuth = twilioAuth;
    global.domain = 'http://test.com';
  });

  it ('param missing', async () => {
    req.body = null;
    await authorizeTwilio (req, res, next);
    expect (res.status).toHaveBeenCalledWith (401);
    expect (res.send).toHaveBeenCalledWith ('Unauthorized twilio, invalid parameters.');
  });

  it ('invalid request', async () => {
    twilio.validateRequest.mockReturnValue (false);
    await authorizeTwilio (req, res, next);
    expect (res.status).toHaveBeenCalledWith (401);
    expect (res.send).toHaveBeenCalledWith ('Unauthorized twilio, invalid request.');
  });

  it ('valid', async () => {
    twilio.validateRequest.mockReturnValue (true);
    await authorizeTwilio (req, res, next);
    expect (next).toHaveBeenCalled ();
  });
});


// test authorize user
const authorizeUser = require ('../userAuth'); // replace with your actual file path

describe ('authorizeUser', () => {
  let req;
  let res;
  let next;

  beforeEach (() => {
    req = {
      body: {
        From: '+1234567890',
        StirVerstat: 'A',
      },
    };
    res = {
      set: jest.fn (),
      send: jest.fn (),
    };
    next = jest.fn ();
  });

  it ('should send voice response if number is not authorized', () => {
    req.body.From = '+1234567890';
    authorizeUser (req, res, next);
    expect (res.set).toHaveBeenCalledWith ('Content-Type', 'text/xml');
    expect (res.send).toHaveBeenCalled ();
    expect (next).not.toHaveBeenCalled ();
  });

  it ('should call next if number is authorized', () => {
    authorizeUser (req, res, next);
    expect (next).toHaveBeenCalled ();
  });
});

describe ('shaken', () => {
  let req;

  beforeEach (() => {
    req = {
      body: {
        StirVerstat: 'A',
      },
    };
  });

  it ('should return false if StirVerstat is not present', () => {
    req.body.StirVerstat = null;
    const result = shaken (req);
    expect (result).toBe (false);
  });

  it ('should return false if StirVerstat is not "A"', () => {
    req.body.StirVerstat = 'B';
    const result = shaken (req);
    expect (result).toBe (false);
  });

  it ('should return true if StirVerstat is "A"', () => {
    const result = shaken (req);
    expect (result).toBe (true);
  });
});
