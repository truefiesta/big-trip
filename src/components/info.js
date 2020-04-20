import AbstractComponent from "../components/abstract-component.js";

const createTripMainInfoElement = () => {
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>`
  );
};

export default class Info extends AbstractComponent {
  getTemplate() {
    return createTripMainInfoElement();
  }
}
