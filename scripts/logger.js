const RESET_COLOR = '\x1b[0m';
const MAGENTA_COLOR = '\x1b[35m';
const RED_COLOR = '\x1b[33m';
const GREEN_COLOR = '\x1b[32m';

/**
 * @param {string} message
 */
exports.logInfo = (message) => {
  console.info(MAGENTA_COLOR, `${message}${RESET_COLOR}`);
};

/**
 * @param {string} message
 */
exports.logSuccess = (message) => {
  console.info(GREEN_COLOR, `${message}${RESET_COLOR}`);
};

/**
 * @param {string} message
 */
exports.logFail = (message) => {
  console.error(RED_COLOR, `${message}${RESET_COLOR}`);
};
