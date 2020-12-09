const valueExists = (arr, key) => (typeof arr[key] !== 'undefined') && arr[key] !== null;

export {
  valueExists,
};