/**
 * Main entry file
 * Setup DB, read ENV variables ans configure Server
 */
import 'reflect-metadata';
import Container from 'typedi';
import Server from './server';
import DB from './loaders/Database';
import EnvConfig from './config/envConfig';
import LoggerService from './loaders/Logger';

const Main = async () => {
  Container.get(EnvConfig);
  const Logger = Container.get(LoggerService);
  Logger.info('start DB', {
    component: 'serverBoot',
  });
  const DBService = Container.get(DB);
  DBService.connectDatabase();

  Logger.info('configure Server,routes and start it', {
    component: 'serverBoot',
  });

  const MainService = Container.get(Server);
  MainService.configureServer();
  MainService.configureRoutes();
  MainService.startServer();
};

Main().catch((e) => console.log('Error in service bootup ', e));
