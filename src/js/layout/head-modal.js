const Modal = require("modal-vanilla");

class HeadModal {
  constructor() {
    this.elements = {};
    this.scripts = [];
    this.createUI();
    this.modal = new Modal({
      el: document.body.querySelector("#static-modal"),
    });
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
            <h4 class="modal-title">Append To Head</h4>  
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button> 
          </div>
          <div class="modal-body">
              <div class='d-flex flex-column head-input-container'>
              </div>
              <div class='d-flex flex-row'>
                <button class='btn btn-info add-head-input'>+ Add Item</button>
              </div>
            <div class='d-flex flex-row alert alert-info mt-3'>
              <small>Instructions: These input fields only accept a src attribute for loading a JS file from a local path or from a CDN. This way you can test other JS libraries in the Sandbox as needed.</small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-info" data-dismiss="modal">CLOSE</button>  
            <button class='btn btn-info head-append mr-3'>APPEND</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    `;

    let appendBtn = div.querySelector(".head-append");
    let clearBtn = div.querySelector(".head-clear");

    let addHeadInput = div.querySelector(".add-head-input");
    addHeadInput.onclick = () => {
      this.addInput();
    };

    appendBtn.onclick = () => {
      this.injectHeadCode();
    };

    this.elements = {
      ...this.elements,
      modalInner: div,
      appendBtn,
    };

    document.body.appendChild(div);
  }

  addInput() {
    let div = document.createElement("div");
    div.classList.add("d-flex", "flex-row", "mb-3");
    div.innerHTML = /*html*/ `
      <input type='text' class='head-item-input d-flex flex-grow-1' placeholder='Add Script SRC attribute only here'/>
      <button class='btn btn-info item-remove ml-2'>X</button>
    `;
    let input = div.querySelector(".head-item-input");
    let btn = div.querySelector(".item-remove");

    btn.onclick = () => {
      this.removeHeadCode(input.value);
      div.parentNode.removeChild(div);
    };
    let headInputContainer = document.querySelector(".head-input-container");
    headInputContainer.appendChild(div);
  }

  removeHeadCode(src) {
    if (!this.scripts.length) return;
    this.scripts.forEach((script, index) => {
      if (src === script.src) {
        script.parentNode.removeChild(script);
        this.scripts = this.scripts.filter((i) => i.src !== src);
      }
    });
  }

  injectHeadCode() {
    let head = document.querySelector("head");
    let allInputs = document.querySelectorAll(".head-item-input");
    [...allInputs].forEach((input) => {
      input.setAttribute("disabled", true);
      if (!head.innerHTML.includes(input.value)) {
        let script = document.createElement("script");
        script.src = input.value;
        this.scripts.push(script);
        head.appendChild(script);
      }
    });
  }
}

module.exports = HeadModal;
