import AbstractComponent from "../components/abstract-component.js";

const sortNames = [`Event`, `Time`, `Price`];

// <label class="trip-sort__btn  trip-sort__btn--active  trip-sort__btn--by-increase" for="sort-time">
const createSortItemTemplate = (sortName, isChecked) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortName.toLowerCase()}">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortName.toLowerCase()}" ${isChecked ? `checked` : ``}>
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

export default class Filter extends AbstractComponent {
  getTemplate() {
    return createTripSortTemplate(sortNames);
  }
}
