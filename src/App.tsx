import { defineComponent, reactive, ref } from 'vue';
import { RouterView } from 'vue-router';
import '@/src/assets/styles/app.less';
import TitleBar from './components/TitleBar';
import router from './router';
import {
  dateZhCN,
  NButton,
  NConfigProvider,
  NDialogProvider,
  NIcon,
  NMessageProvider,
  NModalProvider,
  zhCN
} from 'naive-ui';
import { AccessibilityOutline, CodeSlashOutline, MenuOutline } from '@vicons/ionicons5';
import { routerMap } from './constant';
import { IconFont } from './components/Components';

export default defineComponent({
  name: 'App',
  mounted() {
    instance.moutend();
  },
  setup() {
    return () => (
      <NConfigProvider locale={zhCN} date-locale={dateZhCN}>
        <NMessageProvider>
          <NModalProvider>
            <NDialogProvider>
              <div class="app">
                <div class="header">
                  <TitleBar />
                </div>
                <div class="content">
                  <div class="left_menu">
                    {routerMap.map((item) => {
                      console.log('Log-- ', item, router.currentRoute.value.fullPath, 'item');
                      return (
                        <div
                          v-show={item.icon}
                          class={{
                            active:
                              router.currentRoute.value.fullPath.split('/')[1] ===
                              item.path.split('/')[1],
                            menu_item: true
                          }}
                        >
                          <router-link to={item.path}>{IconFont(item.icon || '')}</router-link>
                        </div>
                      );
                    })}
                  </div>
                  <div class="main_content">
                    <RouterView class={'main_router_content'} />
                  </div>
                </div>
              </div>
            </NDialogProvider>
          </NModalProvider>
        </NMessageProvider>
      </NConfigProvider>
    );
  }
});

const instance = new (class {
  moutend() {
    router.push('/home');
  }
  reacData = reactive({});
  data = {};

  refData = ref({});
})();
