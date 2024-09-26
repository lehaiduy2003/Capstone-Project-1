const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/authentication');
const { getTokenFromHeaders } = require('../utils/token');

jest.mock('jsonwebtoken');
jest.mock('../utils/token');

describe('authenticateToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  // Test when the token is null or undefined.
  test('should return 401 if token is null or undefined', () => {
    getTokenFromHeaders.mockReturnValue(null);

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // Test when the token is invalid or expired.
  test('should return 403 if token is invalid or expired', () => {
    getTokenFromHeaders.mockReturnValue('invalid_token');
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('invalid token'), null);
    });

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  // Test when the token is valid.
  test('should call next if token is valid', () => {
    const user = { id: 1, name: 'test' };
    getTokenFromHeaders.mockReturnValue('valid_token');
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, user);
    });

    authenticateToken(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  // Test when the token is missing from headers.
  test('should return 401 if token is missing from headers', () => {
    getTokenFromHeaders.mockReturnValue(undefined);

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // Test when jwt.verify throws an unexpected error.
  test('should return 403 if jwt.verify throws an unexpected error', () => {
    getTokenFromHeaders.mockReturnValue('valid_token');
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('unexpected error'), null);
    });

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  // Test when jwt.verify returns a malformed user object.
  test('should return 403 if jwt.verify returns a malformed user object', () => {
    getTokenFromHeaders.mockReturnValue('valid_token');
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, null);
    });

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  // // Test when the token is expired.
  // test('should return 401 if token is expired', () => {
  //   const expiredPayload = { id: 1, name: 'test', exp: Date.now() - 1000 }; // expired 1 second ago

  //   getTokenFromHeaders.mockReturnValue('expired_token');
  //   jwt.verify.mockImplementation((token, secret, callback) => {
  //     callback(null, expiredPayload);
  //   });

  //   authenticateToken(req, res, next);

  //   expect(res.status).toHaveBeenCalledWith(401);
  //   expect(res.status().json).toHaveBeenCalledWith({ message: 'Token has expired' });
  //   expect(next).not.toHaveBeenCalled();
  // });
});