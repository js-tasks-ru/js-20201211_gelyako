import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  pageSize = 30;
  order = {};
  rowsLoaded = 0;

  constructor(headersConfig = [],
              {
                url,
                data = []
              } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;

    if (url) {
      this.url = new URL(url, BACKEND_URL);
      this.serverSide = true;
      window.addEventListener('scroll', this.onScrollListener);
    } else {
      this.serverSide = false;
    }

    this.render();
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow()}
      </div>
    `;
  }

  getHeaderSortingArrow() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`;
  }

  async loadData() {
    this.element.classList.add("sortable-table_loading");

    if (this.order.field) {
      this.url.searchParams.set('_sort', this.order.field);
      this.url.searchParams.set('_order', this.order.direction);
    }

    if (this.rowsLoaded === 0) {
      this.subElements.body.innerHTML = '';
    }
    this.url.searchParams.set('_start', '' + this.rowsLoaded);
    this.url.searchParams.set('_end', '' + (this.rowsLoaded + this.pageSize));
    this.data = await fetchJson(this.url);

    this.rowsLoaded += this.data.length;

    this.subElements.body.insertAdjacentHTML('beforeend', this.getTableRows(this.data));
    this.element.classList.remove("sortable-table_loading");
  }

  getTableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(this.data)}
      </div>`;
  }

  getTableRows(data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)}
        </a>`;
    }).join('');
  }

  getTableRow(item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody()}
      </div>`;
  }

  async render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable();
    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    if (this.serverSide) {
      await this.loadData();
    }
    this.initEventListeners();
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', (event) => {
      const columnHeader = event.target.closest('.sortable-table__cell');
      if (columnHeader && columnHeader.dataset.sortable === "true") {
        // if this column wasn't sorted (order = undefined), then 'desc'
        const order = columnHeader.dataset.order === 'desc' ? 'asc' : 'desc';
        if (this.serverSide) {
          this.sortOnServer(columnHeader.dataset.id, order);
        } else {
          this.sort(columnHeader.dataset.id, order);
        }
      }
    });
  }

  onScrollListener = (event) => {
    if (this.element.classList.contains("sortable-table_loading"))
      return;
    if (this.element.getBoundingClientRect().bottom < document.documentElement.clientHeight) {
      this.loadData();
    }
  };

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    this.showSortingArrow(field, order);
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  showSortingArrow(field, order) {
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    // NOTE: Remove sorting arrow from other columns
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;
  }

  sortOnServer(field, order) {
    this.order.field = field;
    this.order.direction = order;
    this.rowsLoaded = 0;

    this.loadData();
    this.showSortingArrow(field, order);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === field);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], 'ru');
        case 'custom':
          return direction * customSorting(a, b);
        default:
          return direction * (a[field] - b[field]);
      }
    });
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
    window.removeEventListener('scroll', this.onScrollListener);
  }
}
