const { ConsoleLogger, IConsoleLoggerSettings } = require("@cdm-logger/server");
const Logger = require("bunyan");

const settings = {
  level: "info", // Optional: default 'info' ('trace'|'info'|'debug'|'warn'|'error'|'fatal')
  mode: "short" // Optional: default 'short' ('short'|'long'|'dev'|'raw')
};

const logger = ConsoleLogger.create("<app name>", settings);
module.exports = logger;
