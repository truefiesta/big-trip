import {createElement} from "../utils.js";

const createTripMainInfoSectionElement = () => {
  return `<section class="trip-main__trip-info  trip-info"></section>`;
};

export default class InfoSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripMainInfoSectionElement();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
