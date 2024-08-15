import { imageFormats } from '@/utils/constant';
import { getHTMLFromClass } from '@/utils/html';
import http from '@/utils/http';
import { bufferToArrayBuffer } from '@/utils/js';
import { onlyInput } from '@/utils/jsx';
import { ElLoading, ElMessage } from 'element-plus';
import { downloadFile } from 'js-funcs';
import _ from 'lodash';
import { NRadio } from 'naive-ui';
import { defineComponent, reactive, ref } from 'vue';
import { UploadArea } from '../components/Components';
import { toZip } from '../utils/zip';
import './style/home.less';
export default defineComponent({
  name: 'home',
  setup: () => () => com(),
  async mounted() {
    // const path = 'C:\\Users\\hy\\Downloads\\点位弹窗_2.gif';
    // const res = await http.post('image/gifToApng', {
    //   url: path
    // });
    // if (res.data.code === 200) {
    //   downloadFile(new Blob([bufferToArrayBuffer(res.data.buffer.data)]), res.data.name);
    // }
    // console.log('Log-- ', res, 'res');
  }
});
const ins = new (class {
  moutend() {}
  reacData = reactive({
    frame: 25,
    resolution: 1,
    quality: 80,
    webpQuality: 80,
    format: 'png',
    imgResolution: {
      width: 1920,
      height: 1080,
      rate: 1
    }
  });
  data = {};
  refData = ref({});
})();

const com = () => (
  <div class="home ">
    <div class="home_content gap10 f_c full">
      <div class="box">
        <div class="title">gif转apng</div>
        <UploadArea
          fileChanged={async (files: File[]) => {
            const formdata = new FormData();
            files.map((file) => {
              formdata.append(file.name, file);
            });
            const res = await http.post('image/gifToApngFiles', formdata);
            if (res.data.code === 200) {
              downloadFile(new Blob([bufferToArrayBuffer(res.data.buffer.data)]), res.data.name);
            }
          }}
        ></UploadArea>
      </div>
      <div class="png_to_webm box">
        <div class="title">png序列转webm</div>
        <div class="f_c gap10">
          <div class="lr">
            <div>帧率</div>
            <div>
              {onlyInput({
                defVal: ins.reacData.frame + '',
                onChange: (val) => {
                  ins.reacData.frame = _.toNumber(val);
                }
              })}
            </div>
          </div>
          <div class="lr">
            <div>分辨率比率</div>
            <div>
              {onlyInput({
                defVal: ins.reacData.resolution + '',
                onChange: (val) => {
                  ins.reacData.resolution = _.toNumber(val);
                  console.log('Log-- ', ins.reacData.resolution, '      ins.reacData.resolutio');
                }
              })}
            </div>
          </div>
          <UploadArea
            fileChanged={async (files: File[]) => {
              const zip = await toZip(files);
              const formdata = new FormData();
              const name = 'zip.zip';

              const fps = ins.reacData.frame;
              const resolution = ins.reacData.resolution;
              formdata.append(name, new File([zip], name, { type: 'application/zip' }));

              const loading = ElLoading.service({
                target: getHTMLFromClass('png_to_webm') || 'png_to_webm',
                text: '转换中..'
              });
              const res = await http.post(
                `image/pngToWebm?fps=${fps}&resolution=${resolution}`,
                formdata,
                {
                  responseType: 'blob'
                }
              );
              console.log('Log-- ', res, 'res');
              loading.close();
              ElMessage.success('压缩完成');

              if (res.status === 200) {
                downloadFile(res.data, 'test.webm');
              }
            }}
          ></UploadArea>
        </div>
      </div>
      <div class="to_webp box">
        <div class="title">转为webp</div>
        <div class="f_c gap10">
          <div class="lr">
            <div>质量</div>
            <div>
              {onlyInput({
                defVal: ins.reacData.webpQuality + '',
                onChange: (val) => {
                  ins.reacData.webpQuality = _.toNumber(val);
                }
              })}
            </div>
          </div>
          <UploadArea
            fileChanged={async (files: File[]) => {
              const formdata = new FormData();

              const nameMap: { [key: string]: string } = {};
              files.map((i, idx) => {
                nameMap[idx] = i.name;
                formdata.append(idx + '', i);
              });
              formdata.append('nameMap', JSON.stringify(nameMap));

              console.log('Log-- ', nameMap, 'nameMap');
              const loading = ElLoading.service({
                target: getHTMLFromClass('to_webp') || 'to_webp',
                text: '转换中..'
              });
              const res = await http.post(
                `image/convertToWebp?quality=${ins.reacData.webpQuality || 80}`,
                formdata
              );
              console.log('Log-- ', res, 'res');
              loading.close();
              ElMessage.success('压缩完成');

              if (res.status === 200) {
                downloadFile(new Blob([bufferToArrayBuffer(res.data.data.data)]), res.data.name);
              }
            }}
          ></UploadArea>
        </div>
      </div>
      <div class="compress_imgs box">
        <div class="title">压缩图片</div>
        <div class="f_c gap10">
          <div class="lr">
            <div>质量</div>
            <div>
              {onlyInput({
                defVal: ins.reacData.quality + '',
                onChange: (val) => {
                  ins.reacData.quality = _.toNumber(val);
                }
              })}
            </div>
          </div>
          <UploadArea
            fileChanged={async (files: File[]) => {
              const formdata = new FormData();

              const nameMap: { [key: string]: string } = {};
              files.map((i, idx) => {
                nameMap[idx] = i.name;
                formdata.append(idx + '', i);
              });
              formdata.append('nameMap', JSON.stringify(nameMap));
              formdata.append('quality', ins.reacData.quality + '');

              console.log('Log-- ', nameMap, 'nameMap');
              const loading = ElLoading.service({
                target: getHTMLFromClass('compress_imgs') || 'compress_imgs',
                text: '转换中..'
              });
              const res = await http.post(`image/compressImages`, formdata, {
                responseType: 'blob'
              });
              console.log('Log-- ', res, 'res');
              loading.close();
              ElMessage.success('压缩完成');

              if (res.status === 200) {
                downloadFile(res.data, 'compress_imgs.zip');
              }
            }}
          ></UploadArea>
        </div>
      </div>
      <div class="compress_glb box">
        <div class="title">压缩GLB</div>
        <div class="f_c gap10">
          <div class="lr">
            {/* <div>质量</div>
            <div>
              {onlyInput({
                defVal: ins.reacData.quality + '',
                onChange: (val) => {
                  ins.reacData.quality = _.toNumber(val);
                }
              })}
            </div> */}
          </div>
          <UploadArea
            fileChanged={async (files: File[]) => {
              const formdata = new FormData();

              const nameMap: { [key: string]: string } = {};
              files.map((i, idx) => {
                nameMap[idx] = i.name;
                formdata.append(idx + '', i);
              });
              formdata.append('nameMap', JSON.stringify(nameMap));

              const loading = ElLoading.service({
                target: getHTMLFromClass('compress_glb') || 'compress_glb',
                text: '转换中..'
              });
              const res = await http.post(`glb/compress`, formdata);
              console.log('Log-- ', res, 'res');
              loading.close();
              ElMessage.success('压缩完成');

              if (res.status === 200) {
                downloadFile(
                  new File([bufferToArrayBuffer(res.data.data.data)], res.data.name),
                  res.data.name
                );
              }
            }}
          ></UploadArea>
        </div>
      </div>
      <div class="convert_img box">
        <div class="title">图片格式互转</div>
        <div class="f_c gap10">
          <div class="lr">
            <div>格式</div>
            <div class="f">
              {imageFormats.map((i) => (
                <NRadio
                  checked={ins.reacData.format === i}
                  label={i}
                  name="format"
                  onChange={(val) => {
                    ins.reacData.format = i;
                  }}
                  style="margin-right: 10px;"
                ></NRadio>
              ))}
            </div>
          </div>
          <UploadArea
            fileChanged={async (files: File[]) => {
              const formdata = new FormData();

              const nameMap: { [key: string]: string } = {};
              files.map((i, idx) => {
                nameMap[idx] = i.name;
                formdata.append(idx + '', i);
              });
              console.log('Log-- ', nameMap, 'nameMap');
              formdata.append('nameMap', JSON.stringify(nameMap));
              formdata.append('format', ins.reacData.format);

              const loading = ElLoading.service({
                target: getHTMLFromClass('convert_img') || 'convert_img',
                text: '转换中..'
              });
              const res = await http.post(`image/convert`, formdata);
              loading.close();
              ElMessage.success('压缩完成');

              if (res.status === 200) {
                downloadFile(
                  new File([bufferToArrayBuffer(res.data.data.data)], res.data.name),
                  res.data.name
                );
              }
            }}
          ></UploadArea>
        </div>
      </div>
      <div class="set_resolution box">
        <div class="title">设置图片分辨率</div>
        <div class="f_c gap10">
          <div class="lr">
            <div>宽</div>
            <div>
              {onlyInput({
                defVal: ins.reacData.imgResolution.width + '',
                onChange: (val) => {
                  ins.reacData.imgResolution.width = _.toNumber(val);
                }
              })}
            </div>
          </div>
          <div class="lr">
            <div>高</div>
            <div>
              {onlyInput({
                defVal: ins.reacData.imgResolution.height + '',
                onChange: (val) => {
                  ins.reacData.imgResolution.height = _.toNumber(val);
                }
              })}
            </div>
          </div>
          <UploadArea
            fileChanged={async (files: File[]) => {
              const formdata = new FormData();

              const nameMap: { [key: string]: string } = {};
              files.map((i, idx) => {
                nameMap[idx] = i.name;
                formdata.append(idx + '', i);
              });
              formdata.append('nameMap', JSON.stringify(nameMap));
              formdata.append('width', ins.reacData.imgResolution.width + '');
              formdata.append('height', ins.reacData.imgResolution.height + '');
              const loading = ElLoading.service({
                target: getHTMLFromClass('set_resolution') || 'set_resolution',
                text: '转换中..'
              });
              const res = await http.post(`image/setResolution`, formdata);
              loading.close();
              ElMessage.success('压缩完成');

              if (res.status === 200) {
                downloadFile(
                  new File([bufferToArrayBuffer(res.data.data.data)], res.data.name),
                  res.data.name
                );
              }
            }}
          ></UploadArea>
        </div>
      </div>
      <div class="set_resolution_rate box">
        <div class="title">设置图片分辨率比例</div>
        <div class="f_c gap10">
          <div class="lr">
            <div>比率</div>
            <div>
              {onlyInput({
                defVal: ins.reacData.imgResolution.rate + '',
                onChange: (val) => {
                  ins.reacData.imgResolution.rate = _.toNumber(val);
                }
              })}
            </div>
          </div>

          <UploadArea
            fileChanged={async (files: File[]) => {
              const formdata = new FormData();

              const nameMap: { [key: string]: string } = {};
              files.map((i, idx) => {
                nameMap[idx] = i.name;
                formdata.append(idx + '', i);
              });
              formdata.append('nameMap', JSON.stringify(nameMap));
              formdata.append('resolutionRate', ins.reacData.imgResolution.rate + '');
              const loading = ElLoading.service({
                target: getHTMLFromClass('set_resolution_rate') || 'set_resolution_rate',
                text: '转换中..'
              });
              const res = await http.post(`image/setResolution`, formdata);
              loading.close();
              ElMessage.success('压缩完成');

              if (res.status === 200) {
                downloadFile(
                  new File([bufferToArrayBuffer(res.data.data.data)], res.data.name),
                  res.data.name
                );
              }
            }}
          ></UploadArea>
        </div>
      </div>
    </div>
  </div>
);
