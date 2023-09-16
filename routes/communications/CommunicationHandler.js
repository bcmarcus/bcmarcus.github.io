/**
  * CommunicationHandler is a class that provides a structure for handling communication.
  * It has methods for sending, responding, and reading recent communications.
  * @class
  * @param {boolean} realTime - Determines if the communication is in real time.
  */
class CommunicationHandler {
  /**
    * Constructs a new instance of the CommunicationHandler class.
    * @constructor
    * @param {boolean} realTime - Determines if the communication is real time.
    */
  constructor (realTime = false) {
    this.realTime = realTime;
  }

  /**
    * Sends a message.
    * @async
    * @function send
    * @param {...*} args - The arguments to be sent.
    * @throws {Error} If the method is not implemented.
    */
  async send (...args) {
    throw new Error ('Method \'sendEmail\' must be implemented.');
  }

  /**
    * Responds to a message.
    * @async
    * @function respond
    * @param {...*} args - The arguments to be used in the response.
    * @throws {Error} If the method is not implemented.
    */
  async respond (...args) {
    throw new Error ('Method \'respondEmail\' must be implemented.');
  }

  /**
    * Reads recent messages.
    * @async
    * @function readRecent
    * @param {...*} args - The arguments to be used in reading recent messages.
    * @throws {Error} If the method is not implemented.
    */
  async readRecent (...args) {
    throw new Error ('Method \'readRecentEmailHeaders\' must be implemented.');
  }
}

module.exports = {
  CommunicationHandler,
};
