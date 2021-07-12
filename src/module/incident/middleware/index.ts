/**
 * List Incident end-point related middlewares
 */
import express from 'express';
import Users from '../../../db/users.db';
import { generateErrorObj } from '../../../utils';

/**
 * method to find admin user using authorization token.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const isAdmin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let currUSer = Users.filter(
    (user) => user.token === req.headers['authorization']
  );
  if (currUSer.length > 0 && currUSer[0].isadmin) return next();
  return res
    .status(401)
    .json(generateErrorObj('Only admin can create/delete an incident'));
};

/**
 * validates the body with schema
 *  throws error if body params is invalid
 * @param {*} Incident schema
 */
const ValidateDataMiddleware = (schema: any) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let params =
      req.method.toLowerCase() === 'delete' ? { id: req.params.id } : req.body;
    const { error } = schema.validate(params);
    const valid = error == null;

    if (valid) {
      return next();
    } else {
      const { details } = error;
      const message = details.map((i: any) => i.message).join(',');
      return res
        .status(422)
        .json(generateErrorObj('Invalid Incident Object', message));
    }
  };
};

export { isAdmin, ValidateDataMiddleware };
