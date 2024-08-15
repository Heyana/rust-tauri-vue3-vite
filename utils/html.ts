export const getHTMLFromClass = (name: string, parent?: HTMLElement): HTMLElement | null => {
  return (parent || document).querySelector('.' + name);
};

export const getHTMLFromId = (name: string, parent?: HTMLElement): HTMLElement | null => {
  return (parent || document).querySelector('#' + name);
};
