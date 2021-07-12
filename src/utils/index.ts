import Users from '../db/users.db';
import { IError } from '../models';

/**
 * checks if user is authorized
 * @returns
 */

const getUSer = (token: string | undefined) => {
  let user = Users.filter((user) => user.token === token);
  return user;
};

const generateErrorObj = (msg: String, errObject = {}): IError => ({
  msg,
  error: errObject,
});

export { generateErrorObj, getUSer };
