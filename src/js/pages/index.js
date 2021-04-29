import "scss/index/index.scss";
const CodeMirror = require("codemirror");
const interact = require("interactjs");
const Editor = require("../layout/Editor");
const HeadModal = require("../layout/head-modal");

require("codemirror/mode/javascript/javascript");
require("codemirror/addon/display/autorefresh");
let cm = null;
let hm = null;

const createUI = () => {
  cm = new Editor({ container: ".editor-container" });
  hm = new HeadModal();

  let editHeadBtn = document.querySelector(".edit-head-btn");
  editHeadBtn.onclick = () => {
    hm.show();
  };

  const clearConsoleBtn = document.querySelector(".clear-console-btn");
  clearConsoleBtn.onclick = () => {
    const consoleEl = document.querySelector(".editor-console");
    if (consoleEl) consoleEl.innerHTML = "";
  };

  let editorConsoleOuter = document.querySelector(".editor-console-outer");
  let editorContainerOuter = document.querySelector(".editor-container-outer");
  interact(editorContainerOuter).resizable({
    edges: { top: true, left: true, bottom: true, right: true },
    listeners: {
      move: function (event) {
        let { x, y } = event.target.dataset;

        x = (parseFloat(x) || 0) + event.deltaRect.left;
        y = (parseFloat(y) || 0) + event.deltaRect.top;

        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          //height: `${event.rect.height}px`,
          //transform: `translate(${x}px, ${y}px)`,
        });

        Object.assign(event.target.dataset, { x, y });

        Object.assign(editorConsoleOuter.style, {
          width: `${window.innerWidth - event.rect.width}px`,
        });
      },
    },
  });
};

const onLoad = () => {
  createUI();
  setupLogs();
};

const setupLogs = () => {
  var log = document.querySelector(".editor-console");
  ["log", "debug", "info", "warn", "error"].forEach(function (verb) {
    console[verb] = (function (method, verb, log) {
      return function () {
        const newArgs = [...arguments];
        newArgs.forEach((argument, index) => {
          if (typeof argument === "object" && argument !== null) {
            newArgs[index] = JSON.stringify(argument, null, 2);
          }
        });
        method.apply(console, arguments);
        var msg = document.createElement("div");

        let colorClass = null;

        switch (verb) {
          case "error":
            colorClass = "danger";
            break;

          case "success":
            colorClass = "success";
            break;

          case "warn":
            colorClass = "warning";

          case "info":
            colorClass = "info";
            break;

          case "log":
          default:
            colorClass = "white";
        }

        msg.classList.add(verb, "console-item", "mb-2");
        msg.innerHTML = `<pre style='overflow: visible;' class='text-${colorClass}'>${Array.prototype.slice
          .call(newArgs)
          .join(" ")}</pre><hr />`;
        //msg.textContent = Array.prototype.slice.call(newArgs).join(' ');
        log.appendChild(msg);
      };
    })(console[verb], verb, log);
  });
};

window.onresize = () => {
  let editorConsoleOuter = document.querySelector(".editor-console-outer");
  let editorContainerOuter = document.querySelector(".editor-container-outer");
  Object.assign(editorConsoleOuter.style, {
    width: `${window.innerWidth - editorContainerOuter.offsetWidth}px`,
  });
};

window.onload = onLoad;
