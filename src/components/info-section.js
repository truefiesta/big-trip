import AbstractComponent from "../components/abstract-component.js";

const createTripMainInfoSectionElement = () => {
  return `<section class="trip-main__trip-info  trip-info"></section>`;
};

export default class InfoSection extends AbstractComponent {
  getTemplate() {
    return createTripMainInfoSectionElement();
  }
}
