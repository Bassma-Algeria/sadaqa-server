'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised'));

require('dotenv').config({ path: './.env.test' });
require('ts-node/register/transpile-only');
