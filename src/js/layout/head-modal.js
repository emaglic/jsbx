const Modal = require("modal-vanilla");
const { encodeQueryParam, deleteQueryParam, decodeQueryParam } = require("../helpers/query-params");
const { reactTemplate } = require("../helpers/jsbx-templates/react");
class HeadModal {
  constructor() {
    this.elements = {};
    this.scripts = [];
    this.createUI();
    this.modal = new Modal({
      el: document.body.querySelector("#static-modal"),
    });

    const scripts = decodeQueryParam("scripts");
    this.scriptsList = [];

    if (scripts) {
      if (Array.isArray(scripts)) {
        [...new Set(scripts)].forEach((script) => {
          this.injectHeadScript(script);
          this.addInput(script);
        });
      } else {
        this.addInput(scripts);
        this.injectHeadScript(scripts);
      }
    }
  }

  show() {
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  createUI() {
    let div = document.createElement("div");
    div.id = "static-modal";
    div.classList.add("modal", "fade");
    div.setAttribute("tabindex", "-1");
    div.setAttribute("role", "dialog");

    div.innerHTML = /*html*/ `
    <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">HELP!</h4>  
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button> 
          </div>
          <div class="modal-body">
          
            <div class='d-flex flex-column'>
            <ul class='list-group'>
            <li class='list-group-item active' style='background-color: #17a2b8;'>Overview</li>
              <li class='list-group-item'>This page provides an easy way to test HTML, CSS, and JavaScript in an isolated environment.</li>
              <li class='list-group-item'>At no time does this page store your code in any database on any servers. It lives entirely in the client browser.<br/><br/>However, your code is shareable. The code you write is encoded as base64 and stored in query params in the URL. You can share the URL with others so that they can also see and test your code.<br/><br/>Note that when you make changes to your code, the URL query params change, so sharing the new URL is required.<br/><br/>Also note that the URL length is dependent on how much code you write, so it could get extremely long.<br/><br/>I can't seem to find a hard limit on the maximum allowable length of query strings, so just be advised, it can get LOOOOONG.</li>
            
            </ul>
          </div>
          <hr/>
            <div class='d-flex flex-column'>
              <ul class='list-group'>
              <li class='list-group-item active' style='background-color: #17a2b8;'>Left Panel</li>
                <li class='list-group-item'>Write HTML, CSS and JavaScript in the panels provided at the left, use the tabs to switch between them.</li>
                <li class='list-group-item'>When you are ready to preview your compiled code press the RUN button at the top right of the editor panel.</li>
              </ul>
            </div>
            <hr/>
            <div class='d-flex flex-column'>
              <ul class='list-group'>
              <li class='list-group-item active' style='background-color: #17a2b8;'>Right Panel</li>
                <li class='list-group-item'>Any logs or errors from your code will be displayed in the CONSOLE panel at the right.</li>
                <li class='list-group-item'>The web-page preview will be displayed in the PREVIEW panel at the right.</li>
                <li class='list-group-item'>You can [optionally] click the 'Pop-Out Preview' button in the PREVIEW panel to have the preview also open as a separate window. This window will be automatically refreshed each time you click the RUN button.
                <div class='d-flex flex-column mt-3 alert alert-info'>
                  Note: You must click RUN again after activating the 'Pop-Out Preview' button in order for the pop-out window to be created.
                </div>
                </li>
              </ul>
            </div>

            <div class='d-flex flex-column'>
              <ul class='list-group'>
              <li class='list-group-item active' style='background-color: #17a2b8;'>Script Type</li>
                <li class='list-group-item'>You can [optionally] specify the type attribute for the script tag used in the JS tab by putting in a comment at the top with the following format <b style='font-weight: bold'>&#60;jsbx-script type="application/javascript"&#62;</b><br/><br/>You can use this to change the script panel to text/babel or something else if you want to write JSX code that can be compiled by babel.<br/><br/>Click <a href='http://eben.pizza/projects/jsbx/${reactTemplate}' target='_blank' rel="nofollow">HERE</a> to launch JSBX with basic React boilerplate.<br/><br/>Note: Currently this template only works with the Pop-Out Preview mode. </li>
                </li>
              </ul>
            </div>
            
            <hr/>

            <div class='d-flex flex-column align-items-center mt-3'>
              <small>This is a hobby project created for my own development and testing. You are free to use it as you wish, but I cannot offer any support or guarantees of any kind. If the site goes down or the site's code breaks, you'll have to bear with me until I can get around to fixing it.<br/><br/>With all that out of the way: Happy coding!</small>
            </div>

            <div class='d-flex flex-column align-items-center mt-3'>
              <small>Created by Eben Maglic | 2021 - 2022</small>
            </div>
            
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-info" data-dismiss="modal">OKAY</button>  
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    `;

    this.elements = {
      ...this.elements,
      modalInner: div,
    };

    document.body.appendChild(div);
  }
}

module.exports = HeadModal;
