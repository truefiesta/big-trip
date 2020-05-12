import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {ESCAPE_KEY, ESC_KEY} from "../const.js";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
import cloneDeep from "../../node_modules/lodash/cloneDeep";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
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
   */
  render(event) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event);

    this._eventComponent.setOpenButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setCloseButtonClickHandler(() => {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setEventEditFormSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setEventFavoriteClickHandler(() => {
      const newEvent = cloneDeep(event);
      newEvent.isFavorite = !event.isFavorite;
      this._onDataChange(this, event, newEvent);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._onDataChange(this, event, null);
    });

    if (oldEventComponent && oldEventEditComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._eventEditComponent, oldEventEditComponent);
    } else {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
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
    this._eventEditComponent.reset();
    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === ESCAPE_KEY || evt.key === ESC_KEY;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
