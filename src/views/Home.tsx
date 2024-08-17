import { imageFormats } from "@/utils/constant";
import { getHTMLFromClass } from "@/utils/html";
import http from "@/utils/http";
import { bufferToArrayBuffer } from "@/utils/js";
import { onlyInput } from "@/utils/jsx";
import { ElLoading, ElMessage } from "element-plus";
import { downloadFile } from "js-funcs";
import _ from "lodash";
import { NRadio } from "naive-ui";
import { defineComponent, reactive, ref } from "vue";
import { UploadArea } from "../components/Components";
import { toZip } from "../utils/zip";
import "./style/home.less";
import * as api from "@tauri-apps/api";
import path from "path";
import { appWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";

export default defineComponent({
  name: "home",
  setup: () => () => com(),
  async mounted() {
    const unlisten = await appWindow.onFileDropEvent((event) => {
      if (event.payload.type === "hover") {
        console.log("User hovering", event.payload.paths);
      } else if (event.payload.type === "drop") {
        console.log("User dropped", event.payload.paths);
      } else {
        console.log("File drop cancelled");
      }
    });
    listen("tauri://file-drop", (event) => {
      console.log(event);
    });

    listen("tauri://file-drop-hover", (e) => {
      console.log("Log-- ", e, "e");
      // ...
    });

    // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
    unlisten();
    // const path = 'C:\\Users\\hy\\Downloads\\点位弹窗_2.gif';
    // const res = await http.post('image/gifToApng', {
    //   url: path
    // });
    // if (res.data.code === 200) {
    //   downloadFile(new Blob([bufferToArrayBuffer(res.data.buffer.data)]), res.data.name);
    // }
    // console.log('Log-- ', res, 'res');
  },
});
const ins = new (class {
  moutend() {}
  reacData = reactive({
    frame: 25,
    resolution: 1,
    quality: 80,
    webpQuality: 80,
    format: "png",
    imgResolution: {
      width: 1920,
      height: 1080,
      rate: 1,
    },
  });
  data = {};
  refData = ref({
    data: [],
  });
})();

const com = () => (
  <div class="home ">
    <div class="home_content gap10 f_c full">
      <button
        onClick={async () => {
          const res = await api.dialog.open({
            multiple: true,
            filters: imageFormats.map((i) => ({ name: i, extensions: [i] })),
          });
          console.log("Log-- ", res, "res");
          ins.refData.value.data = await api.invoke("test_magick", {
            json: JSON.stringify({
              files: res,
              format: "png",
              quality: 80,
            }),
          });
          downloadFile(
            new Blob([new Uint8Array(ins.refData.value.data)]),
            "res.zip"
          );

          console.log(
            "Log-- ",
            ins.refData.value.data,
            "   ins.refData.value.data "
          );
        }}
      >
        ceshi
      </button>
      <div class="box">
        <div class="title">图片转码压缩</div>
        <UploadArea
          fileChanged={async (files: File[]) => {
            console.log("Log-- ", files, "files");
            const formdata = new FormData();
            files.map((file) => {
              formdata.append(file.name, file);
            });
            api.core.invoke("format_image", {
              format: files.map((i) =>
                JSON.stringify({
                  name: i.name,
                  type: i.type,
                  path: i.path,
                })
              ),
            });
            console.log(
              "Log-- ",
              {
                format: files.map((i) =>
                  JSON.stringify({
                    name: i.name,
                    type: i.type,
                    path: i.path,
                  })
                ),
              },
              "123"
            );
            return;
            const res = await http.post("image/gifToApngFiles", formdata);
            if (res.data.code === 200) {
              downloadFile(
                new Blob([bufferToArrayBuffer(res.data.buffer.data)]),
                res.data.name
              );
            }
          }}
        ></UploadArea>
      </div>
    </div>
  </div>
);
