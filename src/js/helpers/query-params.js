const { utf8ToBase64, base64ToUtf8 } = require("../helpers/base64converter");

const readQueryData = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params;
};

const encodeQueryParam = (paramName, data) => {
  if ("URLSearchParams" in window) {
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set(paramName, utf8ToBase64(data));
    var newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }
};

const decodeQueryParam = (type) => {
  const params = readQueryData();
  if (params[type] && params[type].length) {
    const decoded = base64ToUtf8(params[type]);
    /* if (decoded.split(",").length > 1) {
      return decoded.split(",").map((item) => item.trim());
    } */
    return decoded;
  }
};

const deleteQueryParam = (type) => {
  if ("URLSearchParams" in window) {
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(type);
    var newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }
};

module.exports = {
  encodeQueryParam,
  deleteQueryParam,
  decodeQueryParam,
};
