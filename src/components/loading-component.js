import AbstractComponent from "./abstract-component.js";

const createLoadingDisplayTemplate = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
};

export default class LoadingComponent extends AbstractComponent {
  getTemplate() {
    return createLoadingDisplayTemplate();
  }
}
