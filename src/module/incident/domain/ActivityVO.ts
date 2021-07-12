/**
 * Generates and returns Activity VO object
 */

import { Service } from 'typedi';
import { IActivity } from '../../../models';

@Service()
class ActivityVO {
  #id: string = '';
  #incident_id: string = '';
  #activity: Object = {
    incident_status: [],
    incident_assignee: [],
  };

  setValues = (doc: any): IActivity => {
    if (doc) {
      this.#id = doc._id;
      this.#incident_id = doc.incident_id;
      this.#activity = doc.activity;
    }
    return this.toJSON();
  };

  toJSON = (): IActivity => ({
    id: this.#id,
    incident_id: this.#incident_id,
    activity: this.#activity,
  });
}

export default ActivityVO;
