/**
 * GuiManager — creates/destroys lil-gui instances per step.
 */
import GUI from 'lil-gui'

let _gui = null

export const GuiManager = {
  /**
   * Create a new GUI attached to a container.
   * @param {HTMLElement} container - viz container element
   * @returns {GUI}
   */
  create(container) {
    this.destroy()
    _gui = new GUI({ container, title: 'Parameters', width: 220 })
    container.style.position = 'relative'
    return _gui
  },

  get() {
    return _gui
  },

  destroy() {
    if (_gui) {
      try { _gui.destroy() } catch(e) {}
      _gui = null
    }
  }
}
