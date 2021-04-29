const CodeMirror = require('codemirror');

class Editor {
	constructor(opts) {
		if (!opts || !opts.container) return;
		this.editor = null;
		let container = null;
		if (typeof opts.container === 'string')
			container = document.querySelector(opts.container);
		if (opts.container.nodeType) container = opts.container;
		this.elements = {
			container,
			runBtn: document.querySelector('.run-btn'),
			clearEditorBtn: document.querySelector('.clear-editor-btn'),
		};
		this.createUI();
	}

	createUI() {
		this.editor = CodeMirror(this.elements.container, {
			theme: 'lucario',
			lineNumbers: true,
			autofocus: true,
			autoRefresh: true,
			mode: 'javascript',
		});

		this.elements.runBtn.onclick = this.runScript.bind(this);
		this.elements.clearEditorBtn.onclick = () => {
			this.setValue('');
		};
	}

	getValue() {
		if (!this.editor) return;
		return this.editor.getValue();
	}

	setValue(value) {
		if (!this.editor) return;
		this.editor.setValue(value);
		return this.editor.getValue();
	}

	runScript() {
		let runner = function (value) {
			eval(value);
		};
		runner(this.getValue());
	}
}

module.exports = Editor;
