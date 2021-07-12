/**
 * Generates and returns IncidentList Data access Object
 */

import { Service } from 'typedi';
import { ISortStr, IincidentListDO } from '../../../models';
import { INCIDENT_API_PARAMS, ORDER_BY } from '../../../common/constants';

@Service()
class IncidentListDO {
  #start_index: number;
  #max: number;
  #sortby: string;
  #orderby: string;
  #filterby: Object[];
  #sortStr: ISortStr;

  setValues = (doc: any): IincidentListDO => {
    if (doc) {
      const {
        start_index = 0,
        max = 25,
        sortby = INCIDENT_API_PARAMS.CREATED_ON,
        orderby = ORDER_BY.DESC,
        filterby = [{}],
      } = doc;

      this.#start_index = start_index;
      this.#max = max;
      this.#sortby = sortby;
      this.#orderby = orderby;
      this.#filterby = filterby;
      this.#sortStr = {};
      this.#sortStr[this.#sortby] = this.#orderby;
    }
    return this.toJSON();
  };

  toJSON = (): IincidentListDO => ({
    start_index: this.#start_index,
    max: this.#max,
    sortby: this.#sortby,
    orderby: this.#orderby,
    filterby: this.#filterby,
    sortStr: this.#sortStr,
  });
}

export default IncidentListDO;
