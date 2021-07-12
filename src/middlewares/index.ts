/**
 * Application level middleware are defined here
 */
import express from 'express';
import { generateErrorObj, getUSer } from '../utils/index';

/**
 * Checks if user is authorized. Throws status 401 for unauthorized access
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const isAuthorizedUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let user = getUSer(req.headers['authorization']);
  if (user.length === 1) return next();
  return res
    .status(401)
    .json(generateErrorObj('Only authorized users can access incidents'));
};

export { isAuthorizedUser };
