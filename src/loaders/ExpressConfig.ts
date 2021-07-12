import express from 'express';
import { Service } from 'typedi';
import cors from 'cors';
import helmet from 'helmet';

@Service()
class ExpressConfig {
  configureServer(app: express.Application) {
    app.use(
      express.urlencoded({
        extended: false,
        limit: '50mb',
      })
    );
    app.use(cors());
    app.use(express.json());
    app.use(helmet());

    app.use(function (
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      res.header('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
      );
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
      next();
    });
  }
}

export default ExpressConfig;
