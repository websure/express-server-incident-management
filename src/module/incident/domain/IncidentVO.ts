/**
 * Generates and returns Incident Response / VO object
 */

import { Service } from 'typedi';
import { Iincident } from '../../../models';

import { STATUS } from '../../../common/constants';

@Service()
class IncidentVO {
  #id: string = '';
  #created_by: string = '';
  #description: string = '';
  #status: string = STATUS.ANALYSIS;
  #title: string = '';
  #assignee: string = '';
  #acknowledge: Boolean = false;
  #type: string = '';

  setValues = (doc: any): Iincident => {
    if (doc) {
      this.#id = doc._id;
      this.#created_by = doc.created_by;
      this.#description = doc.description;
      this.#status = doc.status;
      this.#title = doc.title;
      this.#assignee = doc.assignee;
      this.#acknowledge = doc.acknowledge;
      this.#type = doc.type;
    }
    return this.toJSON();
  };

  toJSON = (): Iincident => ({
    id: this.#id,
    created_by: this.#created_by,
    description: this.#description,
    status: this.#status,
    title: this.#title,
    assignee: this.#assignee,
    acknowledge: this.#acknowledge,
    type: this.#type,
  });
}

export default IncidentVO;
