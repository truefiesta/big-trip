import AbstractComponent from "../components/abstract-component.js";
const sortNames = [`Event`, `Time`, `Price`];

const createSortItemTemplate = (sortType, currentSortType) => {
  const sortTypeString = `sort-${sortType.toLowerCase()}`;
  const isChecked = sortTypeString === currentSortType ? `checked` : ``;

  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType.toLowerCase()}">
      <input id="${sortTypeString}" class="trip-sort__input  visually-hidden" type="radio"
        name="trip-sort" value="${sortTypeString}" ${isChecked}>
      <label class="trip-sort__btn" for="${sortTypeString}">${sortType}</label>
    </div>`
  );
};

const createTripSortTemplate = (sortTypes, currentSortType) => {
  const sortItemsMarkup = sortTypes.map((sortType) =>
    createSortItemTemplate(sortType, currentSortType)).join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortItemsMarkup}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor(sortType) {
    super();
    this._currentSortType = sortType;
  }

  getTemplate() {
    return createTripSortTemplate(sortNames, this._currentSortType);
  }

  getSortName() {
    return this._currentSortType;
  }

  setSortNameChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName.toLowerCase() !== `label`) {
        return;
      }

      const sortName = evt.target.getAttribute(`for`);

      if (this._currentSortType === sortName) {
        return;
      }

      this.getElement().querySelector(`input:checked`).removeAttribute(`checked`);
      this.getElement().querySelector(`input[value=${sortName}]`).setAttribute(`checked`, `true`);

      this._currentSortType = sortName;
      handler(this._currentSortType);
    });
  }
}
