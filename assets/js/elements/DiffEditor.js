import {createElement} from '@fn/dom'

/**
 * @property {HTMLDivElement} container
 * @property {monaco} editor
 */
export default class DiffEditor extends HTMLTextAreaElement {

  async connectedCallback () {
    // On charge monaco
    const {default: monaco} = await import(/* webpackChunkName: "Monaco" */ '../libs/monaco')

    // On crée le contaienr
    this.container = createElement('div', {style: 'height: 600px; border:solid 1px var(--border); background:var(--background);'})
    this.insertAdjacentElement('beforebegin', this.container)

    // On initialise l'éditeur
    const originalModel = monaco.editor.createModel(this.getAttribute('original'), "text/plain");
    const modifiedModel = monaco.editor.createModel(this.value, "text/plain");
    this.editor = monaco.editor.createDiffEditor(this.container, {
      language: 'markdown',
      wordWrap: "on", // Ne fonctionne pas dans le diffEditor : https://github.com/microsoft/vscode/issues/11387
      lineNumbers: "off",
      minimap: {enabled: false}
    });
    this.editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    })
    modifiedModel.onDidChangeContent((event) => {
      this.value = modifiedModel.getLinesContent().join("\n")
    })
    // On masque le champs original
    this.style.display = 'none'
  }

  disconnectedCallback () {
    if (this.editor) {
      this.editor.dispose()
    }
    if (this.container) {
      this.container.parentElement.removeChild(this.container)
    }
  }

}

customElements.define('diff-editor', DiffEditor, {extends: 'textarea'})
