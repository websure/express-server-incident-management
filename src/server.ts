/**
 * Configure Express server with middlewares, interceptors, routes
 * start the server
 */
import express from 'express';
import Container, { Service } from 'typedi';
import ExpressConfig from './loaders/ExpressConfig';
import { PORT } from './config/envConfig';
import LoggerService from './loaders/Logger';
import AppRoutes from './routes/appRoutes';

@Service()
class Server {
  #port: number;
  #app: express.Application = express();
  #logger: LoggerService;

  constructor() {
    this.#port = Container.get(PORT);
    this.#logger = Container.get(LoggerService);
  }

  configureServer = () => {
    let serverConfig = Container.get(ExpressConfig);
    serverConfig.configureServer(this.#app);
  };

  configureRoutes = () => {
    const routes = Container.get(AppRoutes);
    routes.configureRoutes(this.#app);
  };

  startServer = () => {
    this.#app.listen(this.#port, () => {
      this.#logger.info(`Server started at PORT ${this.#port}`, {
        component: 'serverBoot',
      });
    });
  };

  getServer = () => this.#app;
}

export default Server;
