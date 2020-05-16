import AbstractComponent from "./abstract-component";

const createEventItemTemplate = () => {
  return (
    `<li class="trip-events__item"></li>`
  );
};

export default class EventItem extends AbstractComponent {
  getTemplate() {
    return createEventItemTemplate();
  }
}
