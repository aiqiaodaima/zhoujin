/**
 * components util
 */

/**
 * 清理空值，对象
 * @param children
 * @returns {*[]}
 */
export function filterEmpty (children = []) {
  return children.filter(c => c.tag || (c.text && c.text.trim() !== ''))
}

export function removeEmpty(obj, parent, parentKey) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeEmpty(obj[key], obj, key);
    }
    if (obj[key] === undefined || obj[key] === null || (obj[key] !== null && obj[key].length === 0)) {
      delete obj[key];
    }
  });
  if (Object.keys(obj).length === 0) {
    delete parent[parentKey]
  }
  return obj;
}