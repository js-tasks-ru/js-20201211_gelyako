export default class NotificationMessage {

  static instance;

  constructor(message,
              {
                duration = 1000,
                type = 'success'
              } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${Math.round(this.duration/1000)}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  show(container) {
    if (NotificationMessage.instance) {
      NotificationMessage.instance.destroy();
    }

    if (!container) {
      container = document.body;
    }
    container.append(this.element);

    this.timeout = setTimeout(() => this.destroy(), this.duration);
    NotificationMessage.instance = this;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    if (this.element) {
      this.remove();
      this.element = null;
    }
    clearTimeout(this.timeout);
    NotificationMessage.instance = null;
  }
}
