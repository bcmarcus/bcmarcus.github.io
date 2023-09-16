const { realTimeLoop } = require ('../realTimeResponse');

describe ('askGPT', () => {
  test ('validity', async () => {
    const val = 'output';
    const response = await askGPT (`test ${val}`);
    console.log (response);
  });

  test ('speed', async () => {
    const val = 'output';
    const response = await askGPT (`test ${val}`);
    console.log (response);
  });
});
