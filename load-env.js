const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the dev env file
const envFile = path.resolve(__dirname, './environments/dev/.env');
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

// Run the next build command
require('child_process').spawn('next', ['build'], {
  stdio: 'inherit',
  env: process.env
}); 