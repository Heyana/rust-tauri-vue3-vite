import { getFilesByDataTransfer, getFilesFromFileList } from '@/utils/js';
import { defineComponent, ref, StyleValue } from 'vue';

import './style/components.less';
import { OpenDialogSyncOptions } from 'electron';
import { Ref } from 'vue';
import { NIcon, NScrollbar } from 'naive-ui';
import { AddSharp, CloseSharp } from '@vicons/material';
import { createImg } from '@/utils/jsx';
import { CloseCircleOutline, CloseCircleSharp } from '@vicons/ionicons5';
export const UploadArea1 = (map: {
  onUpload: (files: string[]) => void;
  multip?: boolean;
  defPath?: string;
  isFile?: boolean;
  ls?: OpenDialogSyncOptions['properties'];
}) => {
  return (
    <div
      class="select_dir"
      onClick={async (e) => {
        const res = await window.ipc.trigger({
          name: 'open-file-dialog',
          data: {
            ls: map.ls
          }
        });
        map.onUpload(res);
      }}
      onDrop={(e) => {
        e.preventDefault();
        const files = getFilesByDataTransfer(e.dataTransfer as any);
        map.onUpload(files.map((i) => i.path));
      }}
      onDragover={(e) => {
        e.preventDefault();
      }}
      // multiple
    >
      {map.defPath || '点击或拖拽文件到此处'}
    </div>
  );
};

export const BtnsActive = (
  btns: Array<{
    name: string;
    onClick?: () => void;
  }>,
  refIndex: Ref<number>
) => {
  return (
    <div class="btns gap10">
      {btns.map((btn, idx) => {
        return (
          <div
            class={{
              btn: true,
              btn_atv: refIndex.value === idx
            }}
            onClick={() => {
              refIndex.value = idx;
              btn.onClick?.();
            }}
          >
            {btn.name}
          </div>
        );
      })}
    </div>
  );
};
const colorMap = {
  success: 'rgba(23, 88, 234)',
  warning: 'rgba(warning_color)',
  error: 'rgba(error_color)',
  info: 'rgb(0, 0, 0)'
};

export const createIcon = (
  Icon: any,
  map?: {
    status: 'success' | 'warning' | 'error' | 'info';
  }
) => {
  return (
    <div
      class="icon_base   f_center"
      style={{
        width: '60px',
        fontSize: '1.5rem',
        color: map?.status ? colorMap[map.status] : colorMap['info']
      }}
    >
      <NIcon>
        <Icon></Icon>
      </NIcon>
    </div>
  );
};

export const create = (map: { bg: JSX.Element; children: JSX.Element }) => {
  const { bg, children } = map;
  return (
    <div class="bg_container">
      <div class="bg_container_bg">{bg}</div>
      <div class="bg_container_content">{children}</div>
    </div>
  );
};

export const BgContainer = defineComponent({
  name: 'Components',
  props: {
    bg: {
      required: true,
      type: Object
    },
    children: {
      type: Object
    }
  },
  setup:
    (props, { slots }) =>
    () => {
      const tChild = props.children || slots.default?.();
      return (
        <div>
          <div class="bg_container">
            <div class="bg_container_bg">{props.bg}</div>
            <div v-show={tChild} class="bg_container_content">
              {tChild}
            </div>
          </div>
        </div>
      );
    },
  mounted() {}
});

export const Title = (name: string) => {
  return <div class="title">{name}</div>;
};

export const LrBox = (name: string, children: JSX.Element, className?: string) => {
  return (
    <div class={'l_r ' + className}>
      <div>{name}</div>
      <div>{children}</div>
    </div>
  );
};

export const PaddingBox = (height: number) => {
  return <div style={{ height: `${height}px` }}></div>;
};

export const UploadArea = defineComponent({
  name: 'UploadArea',
  props: {
    fileChanged: {
      required: true,
      type: Function
    }
  },
  setup:
    (props, { slots }) =>
    () => {
      const input = ref(null);
      return (
        <div
          class="upload_area"
          onDragover={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();

            const files = getFilesByDataTransfer(e.dataTransfer);
            props.fileChanged(files || []);
          }}
          onClick={() => {
            // const input = document.querySelector(".file_input");
            (input.value as any)?.click();
          }}
        >
          <input
            ref={input}
            onChange={(e: any) => {
              const files = getFilesFromFileList(e.target.files);
              props.fileChanged(files || []);
            }}
            class="file_input"
            multiple
            type="file"
          />
          <div class="content">
            {slots.default ? (
              slots.default()
            ) : (
              <div>
                拖拽文件到此或者 <em>点击</em>
              </div>
            )}
          </div>
        </div>
      );
    },
  mounted() {}
});

export const UploadAreaOnlyDrop = defineComponent({
  name: 'UploadArea',
  props: {
    fileChanged: {
      required: true,
      type: Function
    }
  },
  setup:
    (props, { slots }) =>
    () => {
      const input = ref(null);
      return (
        <div
          class="upload_area"
          onDragover={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();

            const files = getFilesByDataTransfer(e.dataTransfer);
            props.fileChanged(files || []);
          }}
          onClick={() => {
            // const input = document.querySelector(".file_input");
            (input.value as any)?.click();
          }}
        >
          <div class="content">
            {slots.default ? (
              slots.default()
            ) : (
              <div>
                拖拽文件到此或者 <em>点击</em>
              </div>
            )}
          </div>
        </div>
      );
    },
  mounted() {}
});
export const AvatarArea = defineComponent({
  name: 'AvatarArea',
  props: {
    fileChanged: {
      required: true,
      type: Function
    },
    assets: {
      type: String
    }
  },
  setup:
    (props, { slots }) =>
    () => {
      const input = ref(null);
      return (
        <UploadAreaOnlyDrop class="avatar_area" fileChanged={props.fileChanged}>
          <div class="avatar_content">
            <div class="assets" v-show={props.assets}>
              <img src={props.assets} alt="" />
            </div>
            <div
              class="add"
              onClick={() => {
                (input.value as any)?.click();
              }}
            >
              <input
                ref={input}
                onChange={(e: any) => {
                  const files = getFilesFromFileList(e.target.files);
                  props.fileChanged(files || []);
                }}
                class="file_input"
                multiple
                type="file"
              />
              <NIcon class="avatar_icon">
                <AddSharp> </AddSharp>
              </NIcon>
              <div>
                拖拽文件到此或者 <em>点击</em>上传头像
              </div>
            </div>
          </div>
        </UploadAreaOnlyDrop>
      );
    },
  mounted() {}
});
export const ImageArea = defineComponent({
  name: 'AvatarArea',
  props: {
    fileChanged: {
      required: true,
      type: Function
    },
    removeFile: {
      type: Function
    },
    assets: {
      type: Array<string>
    }
  },
  setup:
    (props, { slots }) =>
    () => {
      const input = ref(null);
      return (
        <UploadAreaOnlyDrop class="image_area avatar_area" fileChanged={props.fileChanged}>
          <div class="avatar_content">
            <div class="list" v-show={props.assets}>
              <NScrollbar size={10} xScrollable={true}>
                {props.assets?.map((i) => {
                  return (
                    <div class="item">
                      <div class="close">
                        <NIcon
                          onClick={() => {
                            props.removeFile?.(i);
                          }}
                          class="icon"
                        >
                          <CloseCircleSharp></CloseCircleSharp>
                        </NIcon>
                      </div>
                      <img src={i} alt="" />
                    </div>
                  );
                })}
              </NScrollbar>
            </div>
            <div
              class="add"
              onClick={() => {
                (input.value as any)?.click();
              }}
            >
              <input
                ref={input}
                onChange={(e: any) => {
                  const files = getFilesFromFileList(e.target.files);
                  props.fileChanged(files || []);
                }}
                class="file_input"
                multiple
                type="file"
              />
              <NIcon class="avatar_icon">
                <AddSharp> </AddSharp>
              </NIcon>
              <div>
                拖拽文件到此或者 <em>点击</em>上传图片
              </div>
            </div>
          </div>
        </UploadAreaOnlyDrop>
      );
    },
  mounted() {}
});
export const VideoArea = defineComponent({
  name: 'AvatarArea',
  props: {
    fileChanged: {
      required: true,
      type: Function
    },
    removeFile: {
      type: Function
    },
    assets: {
      type: Array<string>
    }
  },
  setup:
    (props, { slots }) =>
    () => {
      const input = ref(null);
      return (
        <UploadAreaOnlyDrop
          class="video_area image_area avatar_area"
          fileChanged={props.fileChanged}
        >
          <div class="avatar_content">
            <div class="list" v-show={props.assets}>
              <NScrollbar size={10} xScrollable={true}>
                {props.assets?.map((i) => {
                  return (
                    <div class="item">
                      <div class="close">
                        <NIcon
                          onClick={() => {
                            props.removeFile?.(i);
                          }}
                        >
                          <CloseCircleSharp></CloseCircleSharp>
                        </NIcon>
                      </div>
                      <video controls src={i} />
                    </div>
                  );
                })}
              </NScrollbar>
            </div>
            <div
              class="add"
              onClick={() => {
                (input.value as any)?.click();
              }}
            >
              <input
                ref={input}
                onChange={(e: any) => {
                  const files = getFilesFromFileList(e.target.files);
                  props.fileChanged(files || []);
                }}
                class="file_input"
                multiple
                type="file"
              />
              <NIcon class="avatar_icon">
                <AddSharp> </AddSharp>
              </NIcon>
              <div>
                拖拽文件到此或者 <em>点击</em>上传视频
              </div>
            </div>
          </div>
        </UploadAreaOnlyDrop>
      );
    },
  mounted() {}
});
export const UploadAreaBase = defineComponent({
  name: 'UploadAreaBase',
  props: {
    fileChanged: {
      required: true,
      type: Function
    }
  },
  setup:
    (props, { slots }) =>
    () => {
      const input = ref(null);
      return (
        <div
          class="upload_area upload_area_base"
          onDragover={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();

            const files = getFilesByDataTransfer(e.dataTransfer);
            props.fileChanged(files || []);
          }}
          onClick={() => {
            // const input = document.querySelector(".file_input");
            (input.value as any)?.click();
          }}
        >
          <input
            ref={input}
            onChange={(e: any) => {
              const files = getFilesFromFileList(e.target.files);
              props.fileChanged(files || []);
            }}
            class="file_input"
            multiple
            type="file"
          />
          <div class="content ">
            {slots.default ? (
              slots.default()
            ) : (
              <div>
                拖拽文件到此或者 <em>点击</em>
              </div>
            )}
          </div>
        </div>
      );
    },
  mounted() {}
});

export const ScrollX = (children: JSX.Element) => {
  return (
    <div class="scroll_x">
      <NScrollbar xScrollable={true}>
        <div class="scroll_content">{children}</div>
      </NScrollbar>
    </div>
  );
};
export const IconFont = (icon: string, style?: StyleValue) => {
  return <div class={'iconfont ' + icon} style={style || {}}></div>;
};
