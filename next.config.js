/* eslint-disable @typescript-eslint/no-unused-vars */
require('dotenv').config();

const {
  NODE_ENV,
  NODE_OPTIONS,
  NODE_EXE,
  __COMPAT_LAYER,
  ...env
} = process.env;

module.exports = { env };
