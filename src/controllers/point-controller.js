import {getOffersByType} from "../utils/common.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {ESCAPE_KEY, ESC_KEY, EventType, Mode} from "../const.js";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
import PointModel from "../models/point.js";
import moment from "moment";
import cloneDeep from "../../node_modules/lodash/cloneDeep";

// const generateId = () => {
//   return String(new Date() + Math.random());
// };

const DefaultEvent = {
  type: EventType.FLIGHT,
  destination: ``,
  destinationInfo: {
    description: ``,
    photos: []
  },
  offers: [],
  time: {
    startTime: new Date(),
    endTime: new Date()
  },
  price: ``,
  isFavorite: false
};

export const generateDefaultEvent = () => {
  const defauldEvent = cloneDeep(DefaultEvent);
  // defauldEvent.id = generateId();
  // defauldEvent.offers = getOffersByType(EventType.FLIGHT);
  return defauldEvent;
};

const getOfferByOfferTitle = (eventType, offerTitle) => {
  const offers = getOffersByType(eventType);
  for (const offer of offers) {
    if (offer.title === offerTitle) {
      return offer;
    }
  }

  return null;
};

const parseFormData = (formData) => {
  const eventType = formData.get(`event-type`);
  const selectedOffers = [];
  for (const [key, value] of formData.entries()) {

    if (key.startsWith(`event-offer-`)) {
      const offerTitle = value;
      const offer = getOfferByOfferTitle(eventType, offerTitle);
      if (offer) {
        selectedOffers.push(offer);
      }
    }
  }

  const destination = formData.get(`event-destination`);
  const startDate = formData.get(`event-start-time`);
  const endDate = formData.get(`event-end-time`);

  return new PointModel({
    "type": eventType,
    "destination": {
      "name": destination
    },
    "offers": selectedOffers,
    "date_from": moment(startDate, `DD/MM/YY HH:mm`).toDate().toISOString(),
    "date_to": moment(endDate, `DD/MM/YY HH:mm`).toDate().toISOString(),
    "base_price": parseInt(formData.get(`event-price`), 10),
    "is_favorite": false
  });
};

/**
 * Отвечает за смену точки маршрута на форму редактирования.
*/
export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    /** @private Элемент, в который контроллер будет отрисовывать точку маршрута */
    this._container = container;
    /** @private Функция получает на вход точку маршрута и измененную точку маршрута */
    this._onDataChange = onDataChange;
    /** @private Функция вызывается при смене точки маршрута на форму редактирования */
    this._onViewChange = onViewChange;
    /** @private Режим */
    this._mode = Mode.DEFAULT;
    /** @private Точка маршрута */
    this._eventComponent = null;
    /** @private Форма редактирования */
    this._eventEditComponent = null;
    /** @private Обработчик нажатия на клавишу Escape */
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  /**
   * Render method - принимает данные одной точки маршрута (события).
   * Отвечает за отрисовку точки маршрута, ее замену на форму редактирования и
   * наоборот.
   * @param {object} event - Данные одной точки марштура.
   * @param {string} mode - Режим задачи.
   */
  render(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._mode = mode;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, mode);

    this._eventComponent.setOpenButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setCloseButtonClickHandler(() => {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setEventEditFormSubmitHandler(() => {
      const formData = this._eventEditComponent.getData();
      const newEvent = parseFormData(formData);

      this._onDataChange(this, event, newEvent);
    });

    this._eventEditComponent.setEventFavoriteClickHandler(() => {
      // const newEvent = cloneDeep(event);
      const newEvent = PointModel.clone(event);
      newEvent.isFavorite = !newEvent.isFavorite;

      this._onDataChange(this, event, newEvent);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._onDataChange(this, event, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent, RenderPosition.AFTER);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._eventEditComponent.reset();

    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === ESCAPE_KEY || evt.key === ESC_KEY;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, null, null);
      }
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
