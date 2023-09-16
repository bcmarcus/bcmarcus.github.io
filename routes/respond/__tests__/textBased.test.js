const { respond } = require ('../realTimeResponse');

async function testRespond () {
  // needs to test text and email comms
  const response = await respond ();
}


testRespond ();

// describe ('respond', () => {
//   test ('validity', async () => {
//     respond;
//   });

//   test ('speed', async () => {

//   });
// });

