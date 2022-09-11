const CodeMirror = require("codemirror");
const { encodeQueryParam, decodeQueryParam, deleteQueryParam } = require("../helpers/query-params");

class Editor {
  constructor(opts) {
    if (!opts || !opts.container) return;
    this.editor = null;
    this.index = opts.index;
    let container = null;

    /* if (this.index === 0) {
      this.active = true;
    } else {
      this.active = false;
    } */

    if (typeof opts.defaultValue === "string" && opts.defaultValue.length) {
      this.defaultValue = opts.defaultValue;
    } else {
      this.defaultValue = "";
    }
    if (typeof opts.param === "string" && opts.param.length) {
      this.param = opts.param;
    } else {
      return;
    }
    if (typeof opts.mode === "string" && opts.mode.length) {
      this.mode = opts.mode;
    } else {
      return;
    }
    if (typeof opts.container === "string") container = document.querySelector(opts.container);
    if (opts.container.nodeType) container = opts.container;
    this.elements = {
      container,
      editorTabs: document.querySelector(".editor-tabs"),
      runBtn: document.querySelector(".run-btn"),
      clearEditorBtn: document.querySelector(".clear-editor-btn"),
    };
    this.getAllEditors = opts.getAllEditors;
    this.id = String(new Date().getTime());
    this.createUI();
    if (decodeQueryParam(this.param)) {
      this.setValue(decodeQueryParam(this.param));
    } else {
      this.setValue(this.defaultValue);
    }

    let activeTab = decodeQueryParam("activeeditor");

    if (this.param === activeTab) {
      this.active = true;
      this.switchTabs(this.id);
    } else {
      this.active = false;
    }
  }

  getLang() {
    switch (this.mode) {
      case "javascript":
        return "js";

      case "htmlmixed":
        return "html";

      case "css":
        return "css";
    }
  }

  createUI() {
    const innerContainer = document.createElement("div");
    innerContainer.classList.add("editor-inner", `editor-${this.getLang()}`, `editor-${this.id}`);
    this.elements.innerContainer = innerContainer;

    this.elements.container.appendChild(this.elements.innerContainer);
    this.editor = CodeMirror(this.elements.innerContainer, {
      theme: "lucario",
      lineNumbers: true,
      autofocus: true,
      autoRefresh: true,
      mode: this.mode,
    });

    let tabBtn = document.createElement("button");
    tabBtn.classList.add("btn", "btn-info", "ml-2", "editor-tab-btn", `btn-${this.getLang()}`);
    tabBtn.dataset.id = this.id;
    tabBtn.innerHTML = this.getLang().toUpperCase();
    //tabBtn.onclick = this.switchTabs.bind(this);
    tabBtn.onclick = () => {
      this.switchTabs(this.id);
    };
    this.elements.tabButton = tabBtn;

    this.elements.editorTabs.appendChild(this.elements.tabButton);

    if (this.index > 0) {
      this.elements.innerContainer.classList.add("hidden");
    } else {
      this.elements.tabButton.classList.add("selected");
    }

    this.editor.on("keyup", () => {
      if (this.getValue()) encodeQueryParam(this.param, this.getValue());
    });

    /* this.elements.runBtn.onclick = this.runScript.bind(this);
    this.elements.clearEditorBtn.onclick = () => {
      this.setValue("");
      deleteQueryParam(this.param);
    }; */
  }

  switchTabs(id) {
    this.getAllEditors().forEach((editor) => {
      if (editor.id === id) {
        editor.active = true;
      } else {
        editor.active = false;
      }
    });

    [...this.elements.editorTabs.querySelectorAll(".editor-tab-btn")].forEach((editor) => {
      if (editor.dataset.id === id) {
        editor.classList.add("selected");
        encodeQueryParam("activeeditor", this.param);
      } else editor.classList.remove("selected");
    });

    [...this.elements.container.querySelectorAll(".editor-inner")].forEach((editor) => {
      editor.classList.add("hidden");
    });

    let editor = this.elements.container.querySelector(`.editor-${id}`);
    if (editor) editor.classList.remove("hidden");
  }

  getValue() {
    if (!this.editor) return;
    return this.editor.getValue();
  }

  setValue(value, clear = false) {
    if (!this.editor) return;
    this.editor.setValue(value);
    if (clear) deleteQueryParam(this.param);
    return this.editor.getValue();
  }

  runScript() {
    let runner = function (value) {
      //eval(`'use strict'; ${value}`);
      eval(value);
    };
    runner(this.getValue());
  }
}

module.exports = Editor;
