import { Service } from 'typedi';
import express from 'express';
import UserRoutes from '../module/user/routes';
import IncidentRoutes from '../module/incident/routes';
import { isAuthorizedUser } from '../middlewares';

@Service()
class AppRoutes {
  configureRoutes = (app: express.Application) => {
    app.get('/', (_req, res) => {
      res.send('Welcome to Incident Management API');
    });

    app.use('/api/v1/user', UserRoutes);
    app.use('/api/v1/incident', isAuthorizedUser, IncidentRoutes);
  };
}

export default AppRoutes;
