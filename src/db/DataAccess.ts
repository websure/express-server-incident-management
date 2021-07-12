/**
 * Data access layer. connect mongoose schema to DB
 * Uses MongoDB Transactions for multi document operations
 * utility function to create/end a session before DB operations.
 *
 */
import mongoose, { ClientSession } from 'mongoose';
import { Service } from 'typedi';

@Service()
class DataAccess {
  #session: ClientSession;

  getSession = () => this.#session;

  startSession = async () => (this.#session = await mongoose.startSession());

  endSession = () => this.#session.endSession();

  startTransaction = () => this.#session.startTransaction();

  terminateTransaction = async () => await this.#session.abortTransaction();

  commitTransaction = async () => await this.#session.commitTransaction();

  /**
   * Runs MongoDB Transactions to create a unique session
   * All DB operations are either commited / terminated in the same session
   * Accepts an async callback function for CRUD operations
   * @param cb
   *
   * @returns
   */
  runInTransaction = async (cb: any): Promise<mongoose.Document> => {
    try {
      await this.startSession();
      this.startTransaction();
      const doc = await cb(this.#session);
      await this.commitTransaction();
      return doc;
    } catch (e) {
      await this.terminateTransaction();
      throw e;
    } finally {
      this.endSession();
    }
  };

  /**
   * General wrapper function
   * Accepts async cb() to run in a DB session
   * @param cb
   * @returns
   */
  createSession = async (cb: any): Promise<mongoose.Document> => {
    try {
      const doc: mongoose.Document = await this.runInTransaction(cb);
      return doc;
    } catch (error) {
      throw error;
    }
  };
}

export default DataAccess;
