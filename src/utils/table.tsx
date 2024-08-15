import { Obj } from 'js-funcs';
import { ScrollX } from '../components/Components';
import { NTag } from 'naive-ui';

export const createTableColumn = (map: {
  type: 'string' | 'images' | 'videos' | 'textarea' | 'tags';
  title: string;
  key: string;
  otherMap?: Obj;
  isLocalPath?: boolean;
  processData?: (data: any) => any;
}) => {
  const { title, type, key, otherMap, processData } = map;
  switch (type) {
    case 'string': {
      return {
        title,
        width: 100,
        key,
        ...(otherMap || {})
      };
    }
    case 'textarea': {
      return {
        title,
        key,
        width: 200,
        render: (row) => {
          return (
            <div
              style={{
                width: '170px'
              }}
            >
              {row[key]}
            </div>
          );
        },
        ...(otherMap || {})
      };
    }
    case 'images': {
      return {
        title,
        key,
        minWidth: 300,
        width: 450,
        render: (row: any) => {
          return (
            <div
              class="gap10 "
              style={{
                width: '400px',
                height: '180px'
              }}
            >
              {ScrollX(
                <div>
                  {processData?.(row)?.map((i) => {
                    console.log('Log-- ', i, 'i');
                    return (
                      <img
                        style={{
                          width: 'auto'
                        }}
                        src={i}
                        alt=""
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
      };
    }
    case 'tags': {
      return {
        title,
        key,
        width: 100,
        render: (row) => {
          return (
            <div class="gap10">
              {processData?.(row)?.map((i) => {
                return <NTag type="success">{i}</NTag>;
              })}
            </div>
          );
        },
        ...(otherMap || {})
      };
    }
    case 'videos': {
      return {
        key,
        title,
        minWidth: 300,
        width: 450,
        maxWidth: 400,
        render: (row: any) => {
          return (
            <div
              class="gap10 "
              style={{
                width: '400px',
                height: '180px'
              }}
            >
              {ScrollX(
                <div>
                  {processData?.(row)?.map((i) => {
                    return (
                      <video
                        style={{
                          width: 'auto'
                        }}
                        src={i}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
      };
    }
  }
  return {
    title,
    width: 100,
    fixed: 'left',
    key,
    ...(otherMap || {})
  };
};

export const tableMap = {
  // string: ?
};
