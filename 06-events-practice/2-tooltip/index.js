class Tooltip {

  static #instance = null;
  static isInitialized = false;

  constructor() {
    if (!Tooltip.#instance) {
      Tooltip.#instance = this;
    } else {
      return Tooltip.#instance;
    }
  }

  initialize() {
    if (!Tooltip.isInitialized) {
      document.addEventListener('pointerover', this.showOnPointerOver);
    }
  }

  render(text) {
    this.element = document.createElement('div');
    this.element.classList.add('tooltip');
    this.element.innerHTML = text;
    document.body.append(this.element);
  }

  showOnPointerOver = (evt) => {
    if (evt.target.closest('[data-tooltip]')) {
      this.render(evt.target.dataset.tooltip);

      document.addEventListener("pointermove", this.moveOnPointerMove);
      document.addEventListener("pointerout", this.hideOnPointerOut);
      this.moveToPointer(evt);
    }
  };

  moveToPointer(evt) {
    this.element.style.left = evt.clientX + 'px';
    this.element.style.top = evt.clientY + 'px';
  }

  moveOnPointerMove = (evt) => {
    if (this.element) {
      this.moveToPointer(evt);
    }
  };

  hideOnPointerOut = () => {
    this.remove();
  };

  remove() {
    if (this.element) {
      document.removeEventListener('pointerout', this.hideOnPointerOut);
      document.removeEventListener('pointermove', this.moveOnPointerMove);

      this.element.remove();
      this.element = null;
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.showOnPointerOver);

    Tooltip.isInitialized = false;
    this.remove();
    Tooltip.#instance = null;
  }
}

const tooltip = new Tooltip();

export default tooltip;
