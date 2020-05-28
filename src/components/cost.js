import AbstractComponent from "../components/abstract-component.js";

const createTripInfoCostElement = (totalCost) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export default class Cost extends AbstractComponent {
  constructor(totalCost) {
    super();
    this._totalCost = totalCost;
  }

  getTemplate() {
    return createTripInfoCostElement(this._totalCost);
  }
}

