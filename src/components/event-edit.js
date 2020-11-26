import AbstractSmartComponent from "../components/abstract-smart-component.js";
import {transferTypes, activityTypes, Mode} from "../const.js";
import {capitalize, getOffersByType, getDestinationInformation, getDestinations} from "../utils/common.js";
import cloneDeep from "../../node_modules/lodash/cloneDeep";
import moment from "moment";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DefaultData = {
  favoriteButtonState: ``,
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
  resetButtonText: `Cancel`,
  formState: ``,
  isError: false
};

const createEventTypesMarkup = (allTypes, type) => {
  return allTypes.map((eventType) => {
    eventType = eventType.toLowerCase();
    const isChecked = eventType === type.toLowerCase() ? `checked` : ``;
    return (
      `<div class="event__type-item">
        <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked}>
        <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${capitalize(eventType)}</label>
      </div>`
    );
  }).join(`\n`);
};

const compareOffers = (offerOne, offerTwo) => {
  return (
    offerOne.title === offerTwo.title &&
    offerOne.price === offerTwo.price
  );
};

const createAvailableOffersMarkup = (eventType, allOffersForEventType, selectedEventOffers) => {
  let count = 0;
  return allOffersForEventType.map((offerForEventType) => {
    let isChecked = ``;
    if (selectedEventOffers.length > 0) {
      for (const selectedEventOffer of selectedEventOffers) {
        if (compareOffers(offerForEventType, selectedEventOffer)) {
          isChecked = `checked`;
          break;
        }
      }
    }

    count++;
    const {title, price} = offerForEventType;

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${eventType}-${count}" data-offer-price="${price}" type="checkbox" name="event-offer-${eventType}" value="${title}" ${isChecked}>
        <label class="event__offer-label" for="event-offer-${eventType}-${count}">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createOffersSectionMarkup = (eventType, allOffersForEventType, selectedEventOffers) => {
  const eventOffersMarkup = createAvailableOffersMarkup(eventType, allOffersForEventType, selectedEventOffers);
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
    const {src, description} = photo;
    return (
      `<img class="event__photo" src="${src}" alt="${description}">`
    );
  }).join(`\n`);
};

const createDestinationInfoMarkup = (destinationInfo) => {
  const {description, photos} = destinationInfo;
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

const createFavoriteButtonTemplate = (isFavorite, externalData) => {
  const {favoriteButtonState, formState} = externalData;
  const buttonDisabled = favoriteButtonState || formState;
  const favoriteButton = isFavorite ? `checked` : ``;

  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favoriteButton} ${buttonDisabled}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>
    <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
    </button>`
  );
};

const createDestinationOptionsMarkup = () => {
  const destinationNames = getDestinations();
  return destinationNames.map((destination) => {
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

const createEventDetailsTemplate = (type, offers, destinationInfo) => {
  const availableOffersForEventType = getOffersByType(type.toLowerCase());
  const offersSectionMarkup = availableOffersForEventType.length > 0 ? createOffersSectionMarkup(type, availableOffersForEventType, offers) : ``;

  let isDescription = false;
  let isPhotos = false;
  if (destinationInfo) {
    const {description, photos} = destinationInfo;
    isDescription = description !== `` ? true : false;
    isPhotos = false;
    if (photos) {
      isPhotos = photos.length > 0 ? true : false;
    }
  }
  const destinationInfoSectionMarkup = (isDescription || isPhotos) ? createDestinationInfoMarkup(destinationInfo) : ``;

  if (!offersSectionMarkup && !destinationInfoSectionMarkup) {
    return ``;
  }

  return (
    `<section class="event__details">
      ${offersSectionMarkup}
      ${destinationInfoSectionMarkup}
    </section>`
  );
};

const createTripEventEditFormTemplate = (options = {}, mode, isInitialView) => {
  const {type, destination, offers, destinationInfo, price, time, isFavorite, externalData} = options;

  const transferTypeEventsMarkup = createEventTypesMarkup(transferTypes, type);
  const activityTypeEventsMarkup = createEventTypesMarkup(activityTypes, type);
  const isActionType = checkType(type);

  const {startTime, endTime} = time;

  const isModeAdding = mode === Mode.ADDING;

  const eventDetailsMarkup = (isInitialView && isModeAdding) ? `` : createEventDetailsTemplate(type, offers, destinationInfo);
  const destinationOptions = createDestinationOptionsMarkup();

  const favoriteAndRollupButtonsMarkup = isModeAdding ? `` : createFavoriteButtonTemplate(isFavorite, externalData);

  const deleteButtonText = isModeAdding ? externalData.resetButtonText : externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;
  const formState = externalData.formState;
  const buttonState = formState;
  const eventErrorStyle = externalData.isError ? `event--error` : ``;

  return (
    `<form class="event trip-events__item event--edit ${eventErrorStyle}" action="#" method="POST" ${formState}>
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

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
            ${capitalize(type)} ${isActionType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1" required>
          <datalist id="destination-list-1">
            ${destinationOptions}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" step="1" min="0" name="event-price" value="${price}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${buttonState}>${saveButtonText}</button>
        <button class="event__reset-btn" type="reset" ${buttonState}>${deleteButtonText}</button>

        ${favoriteAndRollupButtonsMarkup}
      </header>
      ${eventDetailsMarkup}
    </form>`
  );
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(event, mode) {
    super();
    this._event = event;
    this._mode = mode;
    this._isInitialView = true;
    this._copyEventFields(event);
    this._isFavorite = event.isFavorite;
    this._externalData = DefaultData;
    this._submitHandler = null;
    this._favoriteHandler = null;
    this._closeHandler = null;
    this._deleteButtonClickHandler = null;
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;
    this._subscribeOnEvents();
    this._removeFlatpickrStartDate();
    this._removeFlatpickrEndDate();
    this._applyFlatpickrStartDate();
    this._applyFlatpickrEndDate();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      handler();
    });

    this._submitHandler = handler;
  }

  setFavoriteEventClickHandler(handler) {
    const favoriteButtonElement = this.getElement().querySelector(`input[name=event-favorite]`);

    if (favoriteButtonElement) {
      favoriteButtonElement.addEventListener(`click`, () => {
        this._isFavorite = !this._isFavorite;
        handler();
      });

      this._favoriteHandler = handler;
    }
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setCloseButtonClickHandler(handler) {
    const closeButtonElement = this.getElement().querySelector(`.event__rollup-btn`);

    if (closeButtonElement) {
      closeButtonElement.addEventListener(`click`, handler);

      this._closeHandler = handler;
    }
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  updateData(data) {
    this._externalData = Object.assign({}, this._externalData, data);
    this.rerender();
  }

  getTemplate() {
    return createTripEventEditFormTemplate({
      type: this._type,
      destination: this._destination,
      destinationInfo: this._destinationInfo,
      offers: this._selectedOffers,
      price: this._price,
      time: {
        startTime: this._startTime,
        endTime: this._endTime
      },
      isFavorite: this._isFavorite,
      externalData: this._externalData
    }, this._mode, this._isInitialView);
  }

  recoverListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoriteEventClickHandler(this._favoriteHandler);
    this.setCloseButtonClickHandler(this._closeHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickrStartDate();
    this._applyFlatpickrEndDate();
  }

  removeElement() {
    this._removeFlatpickrStartDate();
    this._removeFlatpickrEndDate();
    super.removeElement();
  }

  reset() {
    const event = this._event;
    this._copyEventFields(event);

    this.rerender();
  }

  _copyEventFields(event) {
    this._type = event.type;
    this._destination = event.destination;
    this._destinationInfo = cloneDeep(event.destinationInfo);
    this._selectedOffers = event.offers.slice();
    this._price = event.price;
    this._startTime = event.time.startTime;
    this._endTime = event.time.endTime;
  }

  _removeFlatpickr(datePropertyName) {
    const flatpickrDate = this[datePropertyName];
    if (flatpickrDate) {
      flatpickrDate.destroy();
      this[datePropertyName] = null;
    }
  }

  _removeFlatpickrStartDate() {
    this._removeFlatpickr(`_flatpickrStartDate`);
  }

  _removeFlatpickrEndDate() {
    this._removeFlatpickr(`_flatpickrEndDate`);
  }

  _applyFlatpickr(datePropertyName, initialValue, element) {
    this._removeFlatpickr(datePropertyName);
    this[datePropertyName] = flatpickr(element, {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      defaultDate: initialValue,
    });
  }

  _applyFlatpickrStartDate() {
    const startDateElement = this.getElement().querySelector(`input[name=event-start-time]`);
    this._applyFlatpickr(`_flatpickrStartDate`, this._startTime.valueOf(), startDateElement);
  }

  _applyFlatpickrEndDate() {
    const endDateElement = this.getElement().querySelector(`input[name=event-end-time]`);
    this._applyFlatpickr(`_flatpickrEndDate`, this._endTime.valueOf(), endDateElement);
  }

  _subscribeOnTypeChange() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._type = evt.target.value;
      this._isInitialView = false;
      this._selectedOffers = [];

      this.rerender();
    });
  }

  _subscribeOnPriceChange() {
    const priceElement = this.getElement().querySelector(`input[name=event-price]`);
    priceElement.addEventListener(`change`, (evt) => {
      this._price = parseInt(evt.target.value, 10);
      if (isNaN(this._price)) {
        this._price = evt.target.value;
      }
    });
  }

  _subscribeOnOffersChange() {
    const availableOffersElement = this.getElement().querySelector(`.event__available-offers`);
    if (!availableOffersElement) {
      return;
    }

    availableOffersElement.addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      const availableOffers = getOffersByType(this._type.toLowerCase());
      const valueOfClickedOffer = evt.target.value;
      const priceOfClickedOffer = parseInt(evt.target.dataset.offerPrice, 10);

      if (evt.target.checked) {
        const selectedOffer = availableOffers.filter((availableOffer) => (availableOffer.title === valueOfClickedOffer) && (availableOffer.price === priceOfClickedOffer));
        this._selectedOffers = this._selectedOffers.concat(selectedOffer);
      } else {
        this._selectedOffers = this._selectedOffers.filter((selectedOffer) => (selectedOffer.title !== valueOfClickedOffer) || (selectedOffer.price !== priceOfClickedOffer));
      }

      this.rerender();
    });
  }

  _validateDestination(destinationElement) {
    const destinationNames = getDestinations();
    const destinationElementValue = destinationElement.value;
    const validationResult = !!destinationNames.find((destinationName) =>
      destinationName.toLocaleLowerCase() === destinationElementValue.toLowerCase()
    );

    if (!validationResult) {
      destinationElement.setCustomValidity(`Unknown destination`);
    } else {
      destinationElement.setCustomValidity(``);
    }

    return validationResult;
  }

  _subscribeOnDestinationChange() {
    const destinationElement = this.getElement().querySelector(`input[name=event-destination]`);
    destinationElement.addEventListener(`change`, (evt) => {

      if (this._validateDestination(destinationElement)) {
        if (evt.target.value.toLowerCase() !== this._destination.toLowerCase()) {
          this._destination = evt.target.value;

          const newDescription = getDestinationInformation(this._destination).description;
          const newPhotos = getDestinationInformation(this._destination).pictures;

          this._destinationInfo.description = newDescription;
          this._destinationInfo.photos = newPhotos;
        }

        this.rerender();
      }
    });
  }

  _subscribeOnStartTimeChange() {
    const endTimeElement = this.getElement().querySelector(`input[name=event-end-time]`);
    const startTimeElement = this.getElement().querySelector(`input[name=event-start-time]`);
    const saveButtonElement = this.getElement().querySelector(`.event__save-btn`);

    startTimeElement.addEventListener(`change`, (evt) => {
      this._startTime = evt.target.value;

      const startMoment = moment(startTimeElement.value, `DD-MM-YYYY HH:mm`);
      const endMoment = moment(endTimeElement.value, `DD-MM-YYYY HH:mm`);

      if (moment(startMoment).isAfter(endMoment)) {
        saveButtonElement.setAttribute(`disabled`, ``);
      } else {
        saveButtonElement.removeAttribute(`disabled`);
      }
    });
  }

  _subscribeOnEndTimeChange() {
    const endTimeElement = this.getElement().querySelector(`input[name=event-end-time]`);
    const startTimeElement = this.getElement().querySelector(`input[name=event-start-time]`);
    const saveButtonElement = this.getElement().querySelector(`.event__save-btn`);

    endTimeElement.addEventListener(`change`, (evt) => {
      this._endTime = evt.target.value;

      const startMoment = moment(startTimeElement.value, `DD-MM-YYYY HH:mm`);
      const endMoment = moment(endTimeElement.value, `DD-MM-YYYY HH:mm`);

      if (moment(endMoment).isBefore(startMoment)) {
        saveButtonElement.setAttribute(`disabled`, ``);
      } else {
        saveButtonElement.removeAttribute(`disabled`);
      }
    });
  }

  _subscribeOnEvents() {
    this._subscribeOnTypeChange();
    this._subscribeOnPriceChange();
    this._subscribeOnOffersChange();
    this._subscribeOnDestinationChange();
    this._subscribeOnStartTimeChange();
    this._subscribeOnEndTimeChange();
  }
}
