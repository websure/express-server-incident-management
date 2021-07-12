/**
 * Logging service.
 */
import { Service } from 'typedi';
import bunyan from 'bunyan';

@Service()
class LoggerService {
  #logger;
  constructor() {
    this.#logger = bunyan.createLogger({ name: 'IncidentApp' });
  }
  info = (msg: String = '', fields: Object = {}) =>
    this.#logger.info(fields, msg);

  error = (msg: String = '', err: Object = {}) =>
    this.#logger.error({ err }, msg);
}

export default LoggerService;
