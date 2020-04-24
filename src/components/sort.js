import AbstractComponent from "../components/abstract-component.js";

const sortNames = [`Event`, `Time`, `Price`];
// Что это делают эти классы (trip-sort__btn--active и trip-sort__btn--by-increase)?
// <label class="trip-sort__btn  trip-sort__btn--active  trip-sort__btn--by-increase" for="sort-time">
const createSortItemTemplate = (sortName, isChecked) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortName.toLowerCase()}">
      <input id="sort-${sortName.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio"
        name="trip-sort" value="sort-${sortName.toLowerCase()}" ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn" for="sort-${sortName.toLowerCase()}">${sortName}</label>
    </div>`
  );
};

const createTripSortTemplate = (sortTypes) => {
  const sortItemsMarkup = sortTypes.map((sortType, i) =>
    createSortItemTemplate(sortType, i === 0)).join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortItemsMarkup}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortName = `sort-${sortNames[0].toLowerCase()}`;
  }

  getTemplate() {
    return createTripSortTemplate(sortNames);
  }

  getSortName() {
    return this._currentSortName;
  }

  setSortNameChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName.toLowerCase() !== `label`) {
        return;
      }

      const sortName = evt.target.getAttribute(`for`);

      if (this._currentSortName === sortName) {
        return;
      }
      // Как это сделать правильно?
      this.getElement().querySelector(`input:checked`).removeAttribute(`checked`);
      this.getElement().querySelector(`input[value=${sortName}]`).setAttribute(`checked`, `true`);

      this._currentSortName = sortName;
      handler(this._currentSortName);
    });
  }
}
