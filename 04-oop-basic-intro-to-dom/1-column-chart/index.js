export default class ColumnChart {

  chartHeight = 50;

  constructor({data = [], label = '', link = '', value = 0} = {}) {
    this._props = {data, label, link, value};
    this.render();
    this.initEventListener();
  }

  render() {
    const element = document.createElement('div');

    const link = this._props.link ? `<a class="column-chart__link" href="${this._props.link}">View all</a>` : '';
    const loading = this._props.data.length === 0 ? 'column-chart_loading' : '';
    const bars = this._getColumnProps(this._props.data).reduce((accumulator, currentValue) =>
      accumulator += `<div style="--value: ${currentValue.value}" data-tooltip="${currentValue.percent}"></div>`, '');

    element.innerHTML = `
      <div class="column-chart ${loading}" style="--chart-height: 50">
        <div class="column-chart__title">
          ${this._props.label}
          ${link}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this._props.value}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${bars}
          </div>
        </div>
      </div>
    `;

    this.element = element.firstElementChild;
  }

  update(newData = []) {
    this._props.data = newData;
    this.render();
  }

  initEventListener() {
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  _getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
}
