import AbstractComponent from "../components/abstract-component.js";

const createTripDayEventsTemplate = () => {
  return (
    `<ul class="trip-events__list"></ul>`
  );
};

export default class Events extends AbstractComponent {
  getTemplate() {
    return createTripDayEventsTemplate();
  }
}
