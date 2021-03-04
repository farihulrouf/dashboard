// module.exports = {
//     env: { TINYMCE_APIKEY: 'jzk7mc0g33puhfbq8q4oq23w0b9cuccqytfiapxjkcc79zhr' },
//     serverRuntimeConfig: {
//       // Will only be available on the server side
//       mySecret: 'secret',
//       secondSecret: process.env.SECOND_SECRET, // Pass through env variables,
//     },
//     publicRuntimeConfig: {
//       // Will be available on both server and client
//       staticFolder: '/static',
//     },
//   }

const withSass = require('@zeit/next-sass');

module.exports = {
  env: {
      TINYMCE_APIKEY: process.env.TINYMCE_APIKEY,
      SOCKET_URL: process.env.PRODUCTION_URL,
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY
  }
}