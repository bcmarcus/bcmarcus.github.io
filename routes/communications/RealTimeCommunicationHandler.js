const { CommunicationHandler } = require ('./CommunicationHandler');

/**
  * RealTimeCommunicationHandler is a class that extends CommunicationHandler.
  * It is used for real-time communication handling.
  * @class
  * @extends {CommunicationHandler}
  */
class RealTimeCommunicationHandler extends CommunicationHandler {
  /**
    * Constructs a new instance of the RealTimeCommunicationHandler class.
    * @constructor
    */
  constructor () {
    super ();
    this.realTime = true;
  }

  /**
    * Sends a real-time communication.
    * @throws {Error} If the method is not implemented.
    */
  send () {
    throw new Error ('Method \'sendEmail\' must be implemented.');
  }

  /**
    * Responds to a real-time communication.
    * @throws {Error} If the method is not implemented.
    */
  respond () {
    throw new Error ('Method \'respondEmail\' must be implemented.');
  }

  /**
    * Reads the most recent real-time communications.
    * @throws {Error} If the method is not implemented.
    */
  readRecent () {
    throw new Error ('Method \'readRecentEmailHeaders\' must be implemented.');
  }
}

module.exports = {
  RealTimeCommunicationHandler,
};
