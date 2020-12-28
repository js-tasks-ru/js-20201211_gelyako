export default class SortableTable {
  subElements = {};

  constructor(header = [], { data = []} = {}) {
    this.header = header;
    this.data = data;

    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = `
        <div class="sortable-table">
            ${this.getHeader()}
            ${this.getBody()}
        </div>
    `;
    this.element = element;

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  getHeader() {
    const headerCells = this.header.map(columnHeader => {
      return `
          <div class="sortable-table__cell" data-id="${columnHeader.id}" data-sortable="${columnHeader.sortable}">
            <span>${columnHeader.title}</span>
          </div>
        `;
    });
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${headerCells.join('')}
      </div>
    `;
  }

  getSortArrow() {
    if (!this.sortArrow) {
      const divElt = document.createElement('div');
      divElt.innerHTML = `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      `;
      this.sortArrow = divElt.firstElementChild;
    }
    return this.sortArrow;
  }

  getBody() {
    return `
        <div data-element="body" class="sortable-table__body">
        ${this.getTableRows()}
        </div>
    `;
  }

  getTableRows() {
    const rows = this.data.map(row => {
      const cells = this.header.map(header => {
        if (header.template) {
          return header.template(row.images);
        } else {
          return `<div class="sortable-table__cell">${row[header.id]}</div>`;
        }
      });
      return `
        <a href="/products/${row.id}" class="sortable-table__row">
          ${cells.join('')}
        </a>
      `;
    });
    return rows.join('');
  }

  sort(fieldValue, orderValue) {
    const columnDescription = this.header.find(h => h.id === fieldValue);
    if (!columnDescription.sortable) {
      return;
    }

    let direction;
    switch (orderValue) {
      case 'asc':
        direction = 1;
        break;
      case 'desc':
        direction = -1;
        break;
      default:
        return;
    }

    let compareFn;
    switch (columnDescription.sortType) {
      case 'number':
        compareFn = (number1, number2) => direction * (number1 - number2);
        break;
      case 'string':
        compareFn = (string1, string2) =>
          direction * string1.localeCompare(string2, ['ru', 'en'], {caseFirst: 'upper'});
        break;
      default:
        return;
    }
    this.data.sort((row1, row2) => compareFn(row1[columnDescription.id], row2[columnDescription.id]));

    let headerCell = this.element.querySelector(`[data-id=${columnDescription.id}]`);
    headerCell.dataset.order = orderValue;
    headerCell.append(this.getSortArrow());
    this.subElements.body.innerHTML = this.getTableRows();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    if (this.element) {
      this.remove();
    }
    this.element = null;
    this.subElements = {};
  }
}
