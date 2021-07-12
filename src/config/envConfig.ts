/**
 * Set all env variables to containers here
 * We use, Typedi - TOKEN to set all constants in our Container
 */
import ENV from 'dotenv';
import { Container, Token, Service } from 'typedi';
import LoggerService from '../loaders/Logger';

ENV.config();

/**
 * Export constants
 */
export const MONGO_URL = new Token<string>();
export const PORT = new Token<number>();

@Service()
class EnvConfig {
  constructor() {
    const Logger = Container.get(LoggerService);
    Container.set(PORT, process.env.PORT || 3000);
    if (process.env.NODE_ENV === 'development') {
      Container.set(MONGO_URL, process.env.MONGO_URL_DEV);
    } else {
      Container.set(MONGO_URL, process.env.MONGO_URL_PROD);
    }
    Logger.info('Environment config loaded');
  }
}

export default EnvConfig;
