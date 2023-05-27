// const interact = require("interactjs");
const Editor = require("../layout/Editor");
const HeadModal = require("../layout/head-modal");
const { compileWindowCode } = require("../layout/create-window");
const { htmlBoilerplate } = require("./file-default-strings");

let leftPanelActive = true;
let rightPanelActive = true;

let cm = null;
let hm = null;

let editorProps = [];
let editors = [];

const handlePanelToggle = (left, right, leftBtn, rightBtn) => {
  if (
    (leftPanelActive && rightPanelActive) ||
    (!leftPanelActive && !rightPanelActive)
  ) {
    leftBtn.classList.remove("btn-danger");
    leftBtn.classList.add("btn-info");
    rightBtn.classList.remove("btn-danger");
    rightBtn.classList.add("btn-info");
    left.classList.remove("hidden", "full-width");
    right.classList.remove("hidden", "full-width");
  } else if (leftPanelActive) {
    right.classList.remove("full-width");
    right.classList.add("hidden");
    left.classList.add("full-width");
    leftBtn.classList.remove("btn-danger");
    leftBtn.classList.add("btn-info");
    rightBtn.classList.add("btn-danger");
    rightBtn.classList.remove("btn-info");
  } else if (rightPanelActive) {
    left.classList.remove("full-width");
    left.classList.add("hidden");
    right.classList.add("full-width");
    leftBtn.classList.add("btn-danger");
    leftBtn.classList.remove("btn-info");
    rightBtn.classList.remove("btn-danger");
    rightBtn.classList.add("btn-info");
  }
};

const getAllEditors = () => {
  return editors;
};

const createUI = () => {
  let htmlProps = {
    container: ".editor-container",
    mode: "htmlmixed",
    param: "html",
    defaultValue: htmlBoilerplate(),
    getAllEditors: getAllEditors,
  };
  let cssProps = {
    container: ".editor-container",
    mode: "css",
    param: "css",
    getAllEditors: getAllEditors,
  };
  let jsProps = {
    container: ".editor-container",
    mode: "javascript",
    param: "js",
    getAllEditors: getAllEditors,
  };

  let editorConsoleOuter = document.querySelector(".editor-console-outer");
  let editorContainerOuter = document.querySelector(".editor-container-outer");

  editorProps.push(cssProps, jsProps, htmlProps);
  editorProps.forEach((props, index) => {
    let e = new Editor({ ...props, index });
    editors.push(e);
  });

  hm = new HeadModal();

  let editHeadBtn = document.querySelector(".edit-head-btn");
  editHeadBtn.onclick = () => {
    hm.show();
  };

  let toggleLeft = document.querySelector(".toggle-left");
  toggleLeft.onclick = () => {
    leftPanelActive = !leftPanelActive;
    if (!leftPanelActive && !rightPanelActive) {
      leftPanelActive = true;
      rightPanelActive = true;
    }
    handlePanelToggle(
      editorContainerOuter,
      editorConsoleOuter,
      toggleLeft,
      toggleRight
    );
  };

  let toggleRight = document.querySelector(".toggle-right");
  toggleRight.onclick = () => {
    rightPanelActive = !rightPanelActive;
    if (!leftPanelActive && !rightPanelActive) {
      leftPanelActive = true;
      rightPanelActive = true;
    }
    handlePanelToggle(
      editorContainerOuter,
      editorConsoleOuter,
      toggleLeft,
      toggleRight
    );
  };

  const clearConsoleBtn = document.querySelector(".clear-console-btn");
  clearConsoleBtn.onclick = () => {
    const consoleEl = document.querySelector(".editor-console");
    if (consoleEl) consoleEl.innerHTML = "";
  };

  /* interact(editorContainerOuter).resizable({
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
  }); */

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

  const saveButton = document.querySelector(".edit-save-btn");
  saveButton.onclick = () => {
    let values = {
      html: "",
      css: "",
      js: "",
    };

    editors.forEach((editor) => {
      let ext = editor.param;
      let name = null;
      let mime = null;
      if (editor.param === "html") {
        name = "index";
        mime = "text/html";
        const head = editor.getValue().split("<head>")[0];
        const body = editor.getValue().split("<head>")[1];
        const injectHead = `${head}<head><link rel='stylesheet' href='./styles.css'>${body}`;
        const injectScript = injectHead.split("</html>")[0];
        const html = `${injectScript}<script src='./index.js'></script>
        </html>`;
        values.html = html;
      } else if (editor.param === "css") {
        name = "styles";
        mime = "text/css";
        values.css = editor.getValue();
      } else if (editor.param === "js") {
        name = "index";
        mime = "text/javascript";
        values.js = editor.getValue();
      }
      const file = new Blob([values[ext]], { type: mime });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = `${name}.${ext}`;
      link.click();
    });
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
