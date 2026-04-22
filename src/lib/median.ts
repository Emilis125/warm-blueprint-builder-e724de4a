export const isMedianApp = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return navigator.userAgent.toLowerCase().indexOf('median') >= 0;
};
