import AbstractComponent from "../components/abstract-component.js";

const createTripDayTemplate = () => {
  return (
    `<li class="trip-days__item  day"></li>`
  );
};

export default class Day extends AbstractComponent {
  getTemplate() {
    return createTripDayTemplate();
  }
}
