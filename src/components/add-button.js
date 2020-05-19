import AbstractComponent from "./abstract-component.js";

const createAddButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class AddButtonComponent extends AbstractComponent {
  getTemplate() {
    return createAddButtonTemplate();
  }

  setOnClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      handler();
    });
  }

  disableElement() {
    this.getElement().setAttribute(`disabled`, ``);
  }

  enableElement() {
    this.getElement().removeAttribute(`disabled`);
  }
}
