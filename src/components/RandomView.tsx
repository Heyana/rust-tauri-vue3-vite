import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
  name: 'RandomView',
  setup: () => () => com(),
  mounted() {
    window.addEventListener('resize', ins.resize);
  }
});
let windowWidth = 0;
let windowHeight = 0;
const ins = new (class {
  max = 45;
  min = 25;
  moutend() {}
  reacData = reactive({});
  data = {};
  refData = ref({});
  resize() {}
  arr: any[] = [];
  onload() {
    console.log('重启,max35,length90 可以,(max=45,length 50 || max45,length 42)就是大限');
    let list: Array<{ i: any; height: number; width: number }> = [],
      width = 0,
      height = 0;

    for (let i = 0; i < 42; i++) {
      height = width = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
      list[i] = { i, height, width };
    }
  }
  random(list: Array<{ i: any; height: number; width: number }>) {
    var arr: any[] = [];
    let y = 0;
    // if (e.size.windowWidth < windowWidth || e.size.windowHeight < e.size.windowHeight) return;
    windowHeight = 1000;
    windowWidth = 500;
    console.log('windowHeight', windowHeight);
    for (let i = 0; i < list.length; i++) {
      y++;
      var left = Math.floor(Math.random() * windowWidth);
      var top = Math.floor(Math.random() * windowHeight);
      let obj: any = {
        left: left,
        top: top,
        item: list[i]
      };
      if (arr.length == 0) {
        arr.push(obj);
      } else {
        //if_Availability  是否可用
        if (this.ifAvailability(left, top, arr)) {
          arr.push(obj);
          if (i == list.length - 1) this.arr = arr;
        } else {
          i--;
        }
      }
    }
    console.log('Log-- ', arr, 'arr');
  }
  ifAvailability(left, top, arr) {
    let status = true;
    for (let i = 0; i < arr.length; i++) {
      let yLeft = Math.abs(arr[i].left - left);
      let yTop = Math.abs(arr[i].top - top);

      if (yLeft < this.max && yTop < this.max) {
        status = false;
      }
    }
    return status;
  }
})();
const com = () => <div>RandomView</div>;
