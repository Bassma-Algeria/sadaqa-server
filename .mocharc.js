'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');

require('dotenv').config({ path: './.env.test' });
require('ts-node/register');

chai.use(chaiHttp);
chai.use(chaiAsPromised);
