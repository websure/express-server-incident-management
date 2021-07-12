/**
 * Use Mongoose to connect to MongoDB.
 * URL is fetched from Containers
 * Register the class as a service
 */
import mongoose from 'mongoose';
import { Container, Service } from 'typedi';
import { MONGO_URL } from '../config/envConfig';

//Removes the warning with promises
mongoose.Promise = global.Promise;

const dbConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  replicaSet: 'rs',
};

@Service()
class DB {
  //Connect the db with the url provided
  #DBUrl: string;

  constructor() {
    this.#DBUrl = Container.get(MONGO_URL);
  }
  connectDatabase = () => {
    try {
      mongoose.connect(this.#DBUrl, dbConnectionOptions);
    } catch (err) {
      mongoose.createConnection(this.#DBUrl, dbConnectionOptions);
    }

    mongoose.connection
      .once('open', () => console.log('MongoDB Running at ', this.#DBUrl))
      .on('error', (e) => {
        throw e;
      });
  };
}

export default DB;
