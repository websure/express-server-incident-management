import express, { Router } from 'express';
import Container from 'typedi';
import UserController from './controller/UserController';

const routes = new (Router as any)();

const userController = Container.get(UserController);

routes.post('/login', (req: express.Request, res: express.Response) =>
  userController.login(req, res)
);

export default routes;
