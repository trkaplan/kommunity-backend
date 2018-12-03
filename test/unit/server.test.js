/* global jest */
import http from 'http';
import SequelizeMock from 'sequelize-mock';

const app = require('$/server');

const mockSequelize = new SequelizeMock();
const mockModels = {

};

jest.mock('../../src/lib/db-client', () => ({
  __esModule: true, // this property makes it work
  default: () => mockSequelize,
  importModels: () => mockModels,
}));

test('server returns 404', (done) => {
  http.get('http://localhost:4008/unknown-route', (res) => {
    expect(res.statusCode).toBe(404);
    done();
  });
});

test('server returns 401', (done) => {
  http.get('http://localhost:4008/api/v1/member/me', (res) => {
    expect(res.statusCode).toBe(401);
    done();
  });
});

test('server - /health returns OK', (done) => {
  http.get('http://localhost:4008/health', (res) => {
    expect(res.statusCode).toBe(200);

    let response = '';
    res.on('data', (chunk) => {
      response += chunk;
    });

    res.on('end', () => {
      expect(response).toBe('OK');
      done();
    });
  });
});

afterAll((done) => {
  app.server.close(done);
});
