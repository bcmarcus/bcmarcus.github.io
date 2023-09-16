const { logDev, logWarning, logError } = require ('../logging');

expect.extend ({
  toBeWithoutColors (received, argument) {
    const removeAnsiCodes = (str) => str.replace (/\x1B[[(?);]{0,2}(;?\d)*./g, '');
    const cleanedReceived = removeAnsiCodes (received.mock.calls[0][0]);
    if (cleanedReceived === argument) {
      return {
        message: () => `\nExpected: ${argument}\nRecieved: ${cleanedReceived}\n`,
        pass: true,
      };
    } else {
      return {
        message: () => `\nExpected: ${argument}\nRecieved: ${cleanedReceived}\n`,
        pass: false,
      };
    }
  },
});

describe ('logDev', () => {
  let val;
  let logSpy;
  beforeEach (() => {
    val = 'output';
    logSpy = jest.spyOn (global.console, 'log');
  });

  afterEach (() => {
    logSpy.mockRestore ();
  });

  test ('single arg', async () => {
    await logDev (`test output`);
    expect (logSpy).toBeWithoutColors ('---DEV---\t\'test output\'');
    await logDev (`test ${val}`);
    expect (logSpy).toBeWithoutColors ('---DEV---\t\'test output\'');
  });

  test ('multiple args', async () => {
    await logDev (`test`, val);
    expect (logSpy).toBeWithoutColors ('---DEV---\t\'test\'\n\'output\'');
  });
});

describe ('logWarning', () => {
  let val;
  let warnSpy;
  beforeEach (() => {
    val = 'output';
    warnSpy = jest.spyOn (global.console, 'warn');
  });

  afterEach (() => {
    warnSpy.mockRestore ();
  });

  test ('single arg', async () => {
    await logWarning (`test output`);
    expect (warnSpy).toBeWithoutColors ('---WARNING---\t\'test output\'');
    await logWarning (`test ${val}`);
    expect (warnSpy).toBeWithoutColors ('---WARNING---\t\'test output\'');
  });

  test ('multiple args', async () => {
    await logWarning (`test`, val);
    expect (warnSpy).toBeWithoutColors ('---WARNING---\t\'test\'\n\'output\'');
  });
});

describe ('logError', () => {
  let val;
  let errorSpy;
  beforeEach (() => {
    val = 'output';
    errorSpy = jest.spyOn (global.console, 'error');
  });

  afterEach (() => {
    errorSpy.mockRestore ();
  });

  test ('single arg', async () => {
    await logError (`test output`);
    expect (errorSpy).toBeWithoutColors ('---ERROR---\t\'test output\'');
    await logError (`test ${val}`);
    expect (errorSpy).toBeWithoutColors ('---ERROR---\t\'test output\'');
  });

  test ('multiple args', async () => {
    await logError (`test`, val);
    expect (errorSpy).toBeWithoutColors ('---ERROR---\t\'test\'\n\'output\'');
  });
});
