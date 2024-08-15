export const loadImg = (name: string, ext?: string) => {
  return './images/' + name + '.' + (ext || 'png');
};
export const loadVideo = (name: string, ext?: string) => {
  return './videos/' + name + '.' + (ext || 'mp4');
};
export const createImg = (name: string, ext?: string) => {
  return <img src={loadImg(name, ext)} alt="" />;
};

export const getPath = (path: string) => {
  return './images/' + path;
};
export const onlyInput = (map: {
  onChange?: (val: string, target: any) => void;
  inputChange?: (val: any) => void;
  className?: string;
  style?: any;
  defVal?: string;
  width?: number;
  tip?: string;
  type?: string;
  onPointerup?: (e: any) => void;
}) => {
  const { style, type, tip, onChange, className, width, inputChange, onPointerup } = map;
  let isDown = false;

  return (
    <input
      onPointerup={(e) => {
        onPointerup?.(e);
      }}
      onMouseup={(e) => {
        onPointerup?.(e);
      }}
      class={className}
      placeholder={`${tip || ''}`}
      v-model={map.defVal}
      value={map.defVal}
      type={type}
      onMousedown={(e) => {
        e.stopPropagation();
      }}
      onMousemove={() => {
        if (!isDown) return;
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onKeydown={(e: any) => {
        isDown = true;
        e.stopPropagation();
        if (!e.key) return;
      }}
      onMouseleave={() => {
        isDown = false;
      }}
      onKeyup={(e: any) => {
        isDown = false;
        e.stopPropagation();

        if (!e.key) return;
        if (e.key.toLowerCase() === 'enter' || e.key.toLowerCase() === 'Escape') {
          e.target.blur();
          onChange && onChange(e.target.value.trim(), e.target);
        }
      }}
      onInput={(e: any) => {
        e && inputChange && inputChange(e);
      }}
      onChange={(e: any) => {
        e.target.blur();
        onChange && onChange(e.target.value.trim(), e.target);
      }}
      // style={{ width }}
      style={Object.assign(style || {}, width ? { width: width || 0 + 'px' } : { width: '100%' })}
    />
  );
};
