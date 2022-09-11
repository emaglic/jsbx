let iframe = null;

const compileWindowCode = (editorsArray) => {
  let html = "";
  let js = "";
  let css = "";
  editorsArray.forEach((editor) => {
    switch (editor.getLang()) {
      case "html":
        html = editor.getValue();
        break;

      case "css":
        css = editor.getValue();
        break;

      case "js":
      case "javascript":
        js = editor.getValue();
        break;

      default:
        return;
    }
  });

  createWindow({ html, js, css });
};

const createWindow = ({ html, js, css }) => {
  iframe = document.createElement("iframe");

  let previewWindow = document.querySelector(".iframe-preview");
  previewWindow.innerHTML = "";
  previewWindow.appendChild(iframe);

  const inject = /*javascript*/ `
  window.console.log = parent.window.console.log;
  window.console.error = parent.window.console.error;
  window.console.info = parent.window.console.info;
  window.console.warn = parent.window.console.warn;

  window.onerror = (error, url, line) => {
    parent.window.console.error(error, null, ' | line ' + line);
  }
  `;

  const inject2 = /*javascript*/ `
  if(window.onload) window.onload();
  `;

  iframe.contentWindow.document.write(html);

  let styleSheet = iframe.contentWindow.document.createElement("style");
  styleSheet.innerHTML = css;
  iframe.contentWindow.document.head.appendChild(styleSheet);

  let intervalBody = null;

  intervalBody = setInterval(() => {
    if (!iframe.contentWindow.document.body) return;
    clearInterval(intervalBody);
    let injectScript = iframe.contentWindow.document.createElement("script");
    injectScript.innerHTML = inject;
    iframe.contentWindow.document.body.appendChild(injectScript);

    let bodyScript = iframe.contentWindow.document.createElement("script");
    bodyScript.innerHTML = /* javascript */ `(() => { ${js} })()`;
    iframe.contentWindow.document.body.appendChild(bodyScript);

    let injectScript2 = iframe.contentWindow.document.createElement("script");
    injectScript2.innerHTML = inject2;
    iframe.contentWindow.document.body.appendChild(injectScript2);

    const popOutPreview = document.querySelector("#pop-out-preview");
    if (popOutPreview.checked) {
      const newWindow = window.open(null, "Dynamic Popup", "height=" + 1080 + ", width=" + 1920 + "scrollbars=auto, resizable=no, location=no, status=no");
      newWindow.document.write(iframe.contentWindow.document.querySelector("html").innerHTML);
      newWindow.document.close();
    }
  }, 100);
};

module.exports = {
  compileWindowCode,
  createWindow,
};
