/* eslint-disable @typescript-eslint/no-unused-vars */
const {
  NODE_ENV,
  NODE_OPTIONS,
  NODE_EXE,
  __COMPAT_LAYER,
  ...env
} = process.env;

module.exports = {
  typescript: {
    ignoreDevErrors: true,
  },
  experimental: {
    modern: true,
    reactRefresh: true,
  },
  env,
};
