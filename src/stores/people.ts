import { typeCompony } from '@/utils/constant';
import _ from 'lodash';
import { reactive, ref } from 'vue';

export const storePeople = new (class {
  moutend() {}
  reacData = reactive({
    peoples: [] as typeCompony[]
  });
  data = {};
  refData = ref({});
  peopleMap = [] as typeCompony[];

  async getPeoples() {
    this.peopleMap = await this._getPeoples();
    this.reacData.peoples = _.values(this.peopleMap);
    return this.reacData.peoples;
  }
  _getPeoples() {
    return window.preload.people.getList();
  }
})();
