import CostComponent from "../components/cost.js";
import {render, replace, RenderPosition} from "../utils/render.js";

export default class CostController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._costComponent = null;

    this._onEventsChange = this._onEventsChange.bind(this);
    this._pointsModel.setEventsChangeHandler(this._onEventsChange);
  }

  render() {
    const events = this._pointsModel.getAllEvents();
    const totalCost = events.length > 0 ? this._getTotalCost() : 0;

    const oldCostComponent = this._costComponent;
    this._costComponent = new CostComponent(totalCost);

    if (oldCostComponent) {
      replace(this._costComponent, oldCostComponent);
    } else {
      render(this._container, this._costComponent, RenderPosition.BEFOREEND);
    }
  }

  _getTotalCost() {
    const events = this._pointsModel.getAllEvents();

    return events.reduce((totalCost, event) => {
      const {offers, price} = event;

      const offersCost = offers.reduce((offersCostTotal, offer) => {
        return offersCostTotal + offer.price;
      }, 0);

      return totalCost + offersCost + price;

    }, 0);
  }

  _onEventsChange() {
    this.render();
  }
}
