import {createElement} from "../utils.js";

const createTripDayTemplate = () => {
  return (
    `<li class="trip-days__item  day"></li>`
  );
};

export default class Day {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate();
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
