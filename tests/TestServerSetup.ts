import 'reflect-metadata';
import Container from 'typedi';
import Server from '../src/server';
import EnvConfig from '../src/config/envConfig';

Container.get(EnvConfig);

export const TestServer = Container.get(Server);
TestServer.configureServer();
TestServer.configureRoutes();
