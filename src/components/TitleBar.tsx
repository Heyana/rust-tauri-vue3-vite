import { createImg } from '@/utils/jsx';
import { defineComponent, ref } from 'vue';
import './style/title-bar.less';
import {
  CloseFullscreenRound,
  CloseRound,
  LogoDevRound,
  MinimizeRound,
  OpenInFullRound
} from '@vicons/material';
import { NIcon } from 'naive-ui';
export default defineComponent({
  name: 'TitleBar',
  setup: () => () => com(),
  mounted() {
    window.ipc.on('maximize', (v) => {
      refData.full.value = v.state;
      console.log('Log-- ', 7809890, v, '7809890');
    });
  }
});
const refData = {
  full: ref(false)
};
const menu = [
  {
    name: 'mini',
    img: 'miniWin',
    icon: <MinimizeRound />,
    click: () => {
      window.ipc.trigger({
        name: 'mini-window'
      });
      // ipcRenderer.invoke('windows-mini');
    }
  },
  {
    name: 'win',
    elseVal: refData.full,
    elseImg: 'minWin',
    img: 'bigWin',
    icon: <OpenInFullRound />,
    elseIcon: <CloseFullscreenRound />,

    click: () => {
      refData.full.value = !refData.full.value;
      window.ipc.trigger({
        name: 'maximize-window'
      });
    }
  },

  {
    name: 'close',
    img: 'closeWin',
    icon: <CloseRound />,

    click: () => {
      window.ipc.trigger({
        name: 'close-window'
      });
      // ipcRenderer.invoke('window-close');
    }
  }
];
const com = () => (
  <div class="title_bar" style={{ '-webkit-app-region': 'drag' } as any}>
    <div class="left" style={{ '-webkit-app-region': 'no-drag' } as any}>
      <NIcon>
        <LogoDevRound />
      </NIcon>
      {/* <div class="logo">{createImg('logo')}</div> */}
    </div>
    <div class="poa-center">工具集合</div>
    <div class="right" style={{ '-webkit-app-region': 'no-drag' } as any}>
      <div class="contro">
        {menu.map((i) => {
          return (
            <div onClick={i.click} class={i.name}>
              <NIcon>{i.elseVal?.value ? i.elseIcon : i.icon}</NIcon>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
