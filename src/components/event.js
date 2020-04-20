import AbstractComponent from "../components/abstract-component.js";
import {formatTime, formatDate, formatDuration} from "../utils/utils.js";

// В колонке «Offers» отображаются не более 3-х дополнительных опций,
// применённых к точке маршрута. Остальные опции пользователь может
// посмотреть открыв карточку точки маршрута.
const SELECTED_OFFERS_COUNT = 3;

const createOffersMarkup = (offers) => {
  return offers.map(({title, price}) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>`
    );
  }).join(`\n`);
};

export const createTripEventItemTemplate = (event) => {
  const {type, destination, offers, time, price} = event;

  const activityTypes = [
    `Check`,
    `Sightseeing`,
    `Restaurant`
  ];
  const isActivityType = activityTypes.includes(type) ? ` in` : ` to`;
  const typeIconUrl = type.toLowerCase() === `check` ? `check-in` : type.toLowerCase();
  const selectedOffers = offers.slice(0, SELECTED_OFFERS_COUNT);
  const offersMarkup = createOffersMarkup(selectedOffers);
  const {startTime, endTime} = time;
  const duration = endTime - startTime;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${typeIconUrl}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${isActivityType} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDate(startTime)}">${formatTime(startTime)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDate(endTime)}">${formatTime(endTime)}</time>
          </p>
          <p class="event__duration">${formatDuration(duration)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createTripEventItemTemplate(this._event);
  }
}
