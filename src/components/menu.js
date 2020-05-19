import AbstractComponent from "../components/abstract-component.js";
import {MenuItem} from "../const.js";

const MENU_ACTIVE_ITEM_CLASS = `trip-tabs__btn--active`;

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn" data-menu-item="${MenuItem.TABLE}" href="#">Table</a>
      <a class="trip-tabs__btn" data-menu-item="${MenuItem.STATS}" href="#">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createSiteMenuTemplate();
  }

  setActiveItem(menuItem) {
    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    if (items) {
      Array.from(items).forEach((item) => item.classList.remove(MENU_ACTIVE_ITEM_CLASS));
      const newActiveItem = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);
      newActiveItem.classList.add(MENU_ACTIVE_ITEM_CLASS);
    }
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.dataset.menuItem;

      handler(menuItem);
    });
  }
}
