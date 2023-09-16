class EmailHandler {
  send () {
    throw new Error ('Method \'sendEmail\' must be implemented.');
  }

  respond () {
    throw new Error ('Method \'respondEmail\' must be implemented.');
  }

  readRecent () {
    throw new Error ('Method \'readRecentEmailHeaders\' must be implemented.');
  }
}
