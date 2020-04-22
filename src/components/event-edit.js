import AbstractComponent from "../components/abstract-component.js";
import {formatDate} from "../utils/common.js";
import {destinations, transferTypes, activityTypes} from "../const.js";

const createEventTypesMarkup = (eventTypes, type) => {
  return eventTypes.map((eventType) => {
    const typeCheck = eventType === `Check` ? `Check-in` : eventType;
    const isChecked = typeCheck === type ? `checked` : ``;
    return (
      `<div class="event__type-item">
        <input id="event-type-${typeCheck.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeCheck.toLowerCase()}" ${isChecked}>
        <label class="event__type-label  event__type-label--${typeCheck.toLowerCase()}" for="event-type-${typeCheck.toLowerCase()}-1">${typeCheck}</label>
      </div>`
    );
  }).join(`\n`);
};

const createAvailableOffersMarkup = (availableOffers) => {
  return availableOffers.map(({type, title, price}) => {
    const isChecked = Math.random() > 0.5 ? `checked` : ``;
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" ${isChecked}>
        <label class="event__offer-label" for="event-offer-${type}-1">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createOffersSectionMarkup = (offers) => {
  const eventOffersMarkup = createAvailableOffersMarkup(offers);
  return (
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${eventOffersMarkup}
        </div>
      </section>`
  );
};

const createDescriptionMarkup = (availableDescription) => {
  return (
    `<p class="event__destination-description">${availableDescription}</p>`
  );
};

const createPhotosMarkup = (photos) => {
  return photos.map((photo) => {
    return (
      `<img class="event__photo" src="${photo}" alt="Event photo">`
    );
  }).join(`\n`);
};

const createDestinationInfoMarkup = (destinationInformation) => {
  const {description, photos} = destinationInformation;
  const descriptionMarkup = !description ? `` : createDescriptionMarkup(description);
  const photosMarkup = photos.length > 0 ? createPhotosMarkup(photos) : ``;

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${descriptionMarkup}
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosMarkup}
        </div>
      </div>
    </section>`
  );
};

const createDestinationOptionsMarkup = () => {
  return destinations.map((destination) => {
    return (
      `<option value="${destination}"></option>`
    );
  }).join(`\n`);
};

const checkType = (type) => {
  const types = activityTypes.map((it) => it.toLowerCase());
  type = type.toString().toLowerCase();

  return types.includes(type) ? ` in` : ` to`;
};

const createTripEventEditFormTemplate = (event) => {
  const {type, destination, offers, destinationInfo, time, price} = event;

  const typeCheck = type === `Check` ? `Check-in` : type;
  const transferTypeEventsMarkup = createEventTypesMarkup(transferTypes, type);
  const activityTypeEventsMarkup = createEventTypesMarkup(activityTypes, type);
  const isActionType = checkType(type);

  const {startTime, endTime} = time;

  const offersSectionMarkup = offers.length > 0 ? createOffersSectionMarkup(offers) : ``;
  const destinationInfoSectionMarkup = !destinationInfo ? `` : createDestinationInfoMarkup(destinationInfo);
  const isFavorite = Math.random() > 0.5 ? `checked` : ``;
  const destinationOptions = createDestinationOptionsMarkup();

  return (
    `<li class="trip-events__item">
      <form class="event trip-events__item event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${typeCheck.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${transferTypeEventsMarkup}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${activityTypeEventsMarkup}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${typeCheck} ${isActionType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationOptions}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(startTime)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(endTime)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersSectionMarkup}
          ${destinationInfoSectionMarkup}
        </section>
      </form>
    </li>`
  );
};

export default class EventEdit extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createTripEventEditFormTemplate(this._event);
  }

  setEventEditFormSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
  }
}
