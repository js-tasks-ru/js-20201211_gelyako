export default class SortableList {

  constructor({items = []} = {}) {
    this.items = items;
    this.items.forEach(item => item.classList.add('sortable-list__item'));
    this.render();
    this.initEventListeners();
  }

  addItem(item) {
    item.classList.add('sortable-list__item');
    this.items.push(item);
    this.element.append(item);
  }

  render() {
    this.element = document.createElement('ul');
    this.element.classList.add('sortable-list');
    this.element.append(...this.items);
    return this.element;
  }

  initEventListeners() {
    this.element.addEventListener('pointerdown', (event) => {
      if (event.target.hasAttribute('data-delete-handle')) {
        event.target.closest('.sortable-list__item').remove();
      }
    });

    this.element.addEventListener('pointerdown', (event) => {
      if (event.target.hasAttribute('data-grab-handle')) {
        const item = event.target.closest('.sortable-list__item');

        let shiftX = event.clientX - item.getBoundingClientRect().left;
        let shiftY = event.clientY - item.getBoundingClientRect().top;
        const placeholder = document.createElement('li');
        placeholder.classList.add('sortable-list__placeholder');
        placeholder.style.height = item.getBoundingClientRect().height + 'px';
        item.before(placeholder);

        item.style.height = item.getBoundingClientRect().height + 'px';
        item.style.width = item.getBoundingClientRect().width + 'px';
        item.style.position = 'fixed';
        item.style.zIndex = 1000;

        const itemHeight = item.getBoundingClientRect().height;

        const moveAt = (clientX, clientY) => {

          item.style.left = clientX - shiftX + 'px';
          item.style.top = clientY - shiftY + 'px';

          // if new coordinates between centers of other items, then draw placeholder there
          const itemAfterPlaceholder = [...this.element.children].find((element, index) => {
            if (element === item || element === placeholder) {
              return false;
            }
            const rect = element.getBoundingClientRect();
            return (clientY - shiftY + itemHeight / 2) < (rect.top + rect.height / 2);
          });
          if (itemAfterPlaceholder) {
            itemAfterPlaceholder.before(placeholder);
          } else {
            this.element.append(placeholder);
          }
        }

        moveAt(event.clientX, event.clientY);

        function onPointerMove(event) {
          moveAt(event.clientX, event.clientY);
        }

        function onPointerUp(event) {
          document.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('pointerup', onPointerUp);
          placeholder.replaceWith(item);
          item.style.removeProperty('position');
          item.style.removeProperty('zIndex');
          item.style.removeProperty('left');
          item.style.removeProperty('top');
          item.style.removeProperty('width');
          item.style.removeProperty('height');
        }

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
      }
    });

    this.element.addEventListener('ondragstart', (event) => {
      if (event.target.hasAttribute('data-grab-handle')) {
        return false;
      }
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
