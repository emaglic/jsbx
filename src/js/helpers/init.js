const interact = require("interactjs");
const Editor = require("../layout/Editor");
const HeadModal = require("../layout/head-modal");
const { compileWindowCode } = require("../layout/create-window");
const { htmlBoilerplate } = require("./file-default-strings");

let cm = null;
let hm = null;

let editorProps = [];
let editors = [];

const getAllEditors = () => {
  return editors;
};

const createUI = () => {
  let htmlProps = { container: ".editor-container", mode: "htmlmixed", param: "html", defaultValue: htmlBoilerplate(), getAllEditors: getAllEditors };
  let cssProps = { container: ".editor-container", mode: "css", param: "css", getAllEditors: getAllEditors };
  let jsProps = { container: ".editor-container", mode: "javascript", param: "js", getAllEditors: getAllEditors };

  editorProps.push(htmlProps, cssProps, jsProps);
  editorProps.forEach((props, index) => {
    let e = new Editor({ ...props, index });
    editors.push(e);
  });

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

  let clearButton = document.querySelector(".clear-editor-btn");
  clearButton.onclick = () => {
    editors.forEach((editor) => {
      if (editor.active === true) {
        editor.setValue("", true);
      }
    });
  };

  const runBtn = document.querySelector(".run-btn");
  runBtn.onclick = () => {
    compileWindowCode(editors);
  };

  const popOutPreviewGroup = document.querySelector(".pop-out-preview-group");
  const popOutPreviewCheck = document.querySelector("#pop-out-preview");
  popOutPreviewGroup.onclick = () => {
    popOutPreviewCheck.checked = !popOutPreviewCheck.checked;
  };

  const consoleBtn = document.querySelector(".iframe-console-btn");
  const previewBtn = document.querySelector(".iframe-preview-btn");
  consoleBtn.onclick = togglePreview;
  previewBtn.onclick = togglePreview;
};

const togglePreview = (evt) => {
  const iframeView = document.querySelector(".iframe-preview");
  const consoleView = document.querySelector(".editor-console");
  const consoleBtn = document.querySelector(".iframe-console-btn");
  const previewBtn = document.querySelector(".iframe-preview-btn");

  const popOutPreviewGroup = document.querySelector(".pop-out-preview-group");
  const clearConsoleBtn = document.querySelector(".clear-console-btn");

  switch (evt.target.dataset.view) {
    case "console":
      consoleView.classList.remove("hidden");
      iframeView.classList.add("hidden");
      consoleBtn.classList.add("selected");
      previewBtn.classList.remove("selected");
      popOutPreviewGroup.classList.add("hidden");
      clearConsoleBtn.classList.remove("hidden");

      break;

    case "iframe":
      iframeView.classList.remove("hidden");
      consoleView.classList.add("hidden");
      consoleBtn.classList.remove("selected");
      previewBtn.classList.add("selected");
      popOutPreviewGroup.classList.remove("hidden");
      clearConsoleBtn.classList.add("hidden");
  }
};

const onResize = () => {
  let editorConsoleOuter = document.querySelector(".editor-console-outer");
  let editorContainerOuter = document.querySelector(".editor-container-outer");
  Object.assign(editorConsoleOuter.style, {
    width: `${window.innerWidth - editorContainerOuter.offsetWidth}px`,
  });
};

const onError = (err) => {
  console.error(err);
};

module.exports = {
  headModule: hm,
  createUI,
  onResize,
  onError,
  getAllEditors,
};
