import AbstractComponent from "../components/abstract-component.js";

const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class Days extends AbstractComponent {
  getTemplate() {
    return createTripDaysTemplate();
  }
}
