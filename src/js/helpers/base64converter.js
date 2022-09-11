const utf8ToBase64 = (str) => {
  return window.btoa(unescape(encodeURIComponent(str)));
};

const base64ToUtf8 = (str) => {
  return decodeURIComponent(escape(window.atob(str)));
};

module.exports = {
  utf8ToBase64,
  base64ToUtf8,
};
