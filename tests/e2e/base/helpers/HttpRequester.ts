import 'chai-http';
import chai from 'chai';

import { Server } from 'http';

interface Headers {
  Authorisation: string;
}

interface Response {
  status: number;
  body: {
    [key in string]: any;
  };
}

class HttpRequester {
  private readonly server: Server;

  constructor(server: Server) {
    this.server = server;
  }

  async post(url: string, body: object, headers?: Headers): Promise<Response> {
    return new Promise((resolve, reject) => {
      chai
        .request(this.server)
        .post(url)
        .send(body)
        .set('Authorisation', headers ? headers.Authorisation : '')
        .end((err, res) => {
          if (err) reject(err);
          resolve(res);
        });
    });
  }

  async get(url: string, headers?: Headers): Promise<Response> {
    return new Promise((resolve, reject) => {
      chai
        .request(this.server)
        .get(url)
        .set('Authorisation', headers ? headers.Authorisation : '')
        .end((err, res) => {
          if (err) reject(err);
          resolve(res);
        });
    });
  }
}

export { HttpRequester };
