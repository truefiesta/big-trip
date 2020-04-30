import {render, RenderPosition, replace} from "../utils/render.js";
import {ESCAPE_KEY, ESC_KEY} from "../const.js";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";

/**
 * Отвечает за смену точки маршрута на форму редактирования.
*/
export default class PointController {
  constructor(container) {
    /** @private Элемент, в который контроллер будет отрисовывать точку маршрута */
    this._container = container;
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

    this._eventEditComponent.setEventEditFormSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    if (oldEventComponent && oldEventEditComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._eventEditComponent, oldEventEditComponent);
    } else {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
    }
  }

  _replaceEventToEdit() {
    replace(this._eventEditComponent, this._eventComponent);
  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === ESCAPE_KEY || evt.key === ESC_KEY;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
