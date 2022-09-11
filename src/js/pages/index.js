require("codemirror/mode/javascript/javascript");
require("codemirror/mode/htmlmixed/htmlmixed");
require("codemirror/mode/css/css");
require("codemirror/addon/display/autorefresh");
import "scss/index/index.scss";
const { setupLogs } = require("../layout/console");
const { headModule, codeModule, createUI, onResize, onError } = require("../helpers/init");

const onLoad = () => {
  createUI();
  setupLogs();
};

window.addEventListener(
  "message",
  (e) => {
    const data = e.data;
    if (data.type === "log") {
      console.log("received from child", data.args);
    }
  },
  true
);

window.onload = onLoad;
