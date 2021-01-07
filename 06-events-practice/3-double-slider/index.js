export default class DoubleSlider {

  elements = {}

  constructor({
                min = 0,
                max = 100,
                formatValue = value => value,
                selected: {
                  from = min,
                  to = max
                } = {},
              } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = {
      from,
      to
    };

    this.render();

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
  }

  render() {
    const elt = document.createElement('div');
    elt.innerHTML = this.getTemplate();

    this.element = elt.firstElementChild;

    const elements = this.element.querySelectorAll('[data-element]');
    elements.forEach(elt => this.elements[elt.dataset.element] = elt);

    this.elements.thumbLeft.addEventListener("pointerdown", e => this.onPointerDown(e));
    this.elements.thumbRight.addEventListener("pointerdown", e => this.onPointerDown(e));
  }

  getTemplate() {
    const borders = this.calculateBorders();
    return `<div class="range-slider">
      <span data-element="from">${this.formatValue(this.selected.from)}</span>
      <div data-element="inner" class="range-slider__inner">
        <span data-element="progress" class="range-slider__progress" style="left: ${borders.left}%; right: ${borders.right}%"></span>
        <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${borders.left}%"></span>
        <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${borders.right}%"></span>
      </div>
      <span data-element="to">${this.formatValue(this.selected.to)}</span>
    </div>`;
  }

  calculateBorders() {
    return {
      left: Math.round((this.selected.from - this.min) * 100 / (this.max - this.min)),
      right: Math.round((this.max - this.selected.to) * 100 / (this.max - this.min)),
    }
  }

  noDrag() {
    return false;
  }

  onPointerDown(evt) {
    this.draggable = evt.target;
    evt.preventDefault();
    this.element.classList.add("range-slider_dragging");
    document.addEventListener("pointermove", this.onPointerMove);
    document.addEventListener("pointerup", this.onPointerUp);
  }

  onPointerUp() {
    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerup", this.onPointerUp);

    this.element.classList.remove("range-slider_dragging");

    this.element.dispatchEvent(new CustomEvent("range-select", {
      detail: this.getValue(),
      bubbles: true,
    }));
  }

  getValue() {
    return {
      from: Math.round(this.min + (this.max - this.min) * parseInt(this.elements.thumbLeft.style.left) / 100),
      to: Math.round(this.max - (this.max - this.min) * parseInt(this.elements.thumbRight.style.right) / 100)
    }
  }

  onPointerMove(evt) {
    if (this.draggable) {
      let newX = Math.round(100 * (evt.clientX - this.elements.inner.getBoundingClientRect().left) /
        this.elements.inner.getBoundingClientRect().width);
      //console.log("" + evt.clientX + '; ' + this.elements.inner.getBoundingClientRect().left);

      if (this.draggable === this.elements.thumbLeft) {
        if (newX < 0) {
          newX = 0;
        }
        let maxRight = parseInt(this.elements.thumbRight.style.right);
        if (newX > (100 - maxRight)) {
          newX = (100 - maxRight);
        }
        this.draggable.style.left = newX + '%';
        this.elements.progress.style.left = newX + '%';
        this.elements.from.textContent = this.formatValue(Math.round(this.min + (this.max - this.min) * newX / 100));

      } else if (this.draggable === this.elements.thumbRight) {

        let minLeft = parseInt(this.elements.thumbLeft.style.left);
        if (newX < minLeft) {
          newX = minLeft;
        }
        if (newX > 100) {
          newX = 100;
        }
        newX = 100 - newX;
        this.draggable.style.right = newX + '%';
        this.elements.progress.style.right = newX + '%';

        this.elements.to.textContent = this.formatValue(Math.round(this.max - (this.max - this.min) * newX / 100));
      }
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerup", this.onPointerUp);
    this.remove();
  }
}
