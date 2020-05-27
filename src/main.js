import API from "./api/index.js";
import {render, RenderPosition} from "./utils/render.js";
import AddButtonComponent from "./components/add-button.js";
import InfoSectionComponent from "./components/info-section.js";
import InfoComponent from "./components/info.js";
import CostComponent from "./components/cost.js";
import MenuComponent from "./components/menu.js";
import StatisticsComponent from "./components/statistics.js";
import FilterController from "./controllers/filter-controller.js";
import TripController from "./controllers/trip-controller.js";
import PointsModel from "./models/points.js";
import {MenuItem, OffersByType, DestinationsInformation} from "./const.js";

const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic hljo1hgHKG9dlPQsdaHIo=`;
const api = new API(END_POINT, AUTHORIZATION);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFilterHeaderElement = tripControlsElement.querySelector(`h2:nth-of-type(2)`);

const pointsModel = new PointsModel();

const menuComponent = new MenuComponent();
render(tripControlsFilterHeaderElement, menuComponent, RenderPosition.BEFORE);
menuComponent.setActiveItem(MenuItem.TABLE);

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

render(tripControlsElement, new InfoSectionComponent(), RenderPosition.BEFORE);

const addButtonComponent = new AddButtonComponent();
render(tripMainElement, addButtonComponent, RenderPosition.BEFOREEND);
addButtonComponent.disableElement();

const tripMainInfoSectionElement = tripMainElement.querySelector(`.trip-info`);
render(tripMainInfoSectionElement, new InfoComponent(), RenderPosition.BEFOREEND);
render(tripMainInfoSectionElement, new CostComponent(), RenderPosition.BEFOREEND);

// Trip
const tripEventsElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsElement, pointsModel, api);
tripController.render();

tripController.setNewEventFormToggleHandler((isOpen) => {
  if (isOpen) {
    addButtonComponent.disableElement();
  } else {
    addButtonComponent.enableElement();
  }
});

const statisticsComponent = new StatisticsComponent(pointsModel);
render(tripEventsElement, statisticsComponent, RenderPosition.AFTER);
statisticsComponent.hide();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATS:
      menuComponent.setActiveItem(MenuItem.STATS);
      tripController.hide();
      statisticsComponent.show();
      break;
  }
});

addButtonComponent.setOnClick(() => {
  statisticsComponent.hide();
  filterController.reset();
  tripController.show();
  tripController.createEvent();
  menuComponent.setActiveItem(MenuItem.TABLE);
});

Promise.all([api.getOffers(), api.getDestinations(), api.getEvents()])
  .then(([offers, destinations, events]) => {
    OffersByType.offers = offers;
    DestinationsInformation.destinations = destinations;
    pointsModel.setEvents(events);
    tripController.setNoLoading();
    addButtonComponent.enableElement();
  })
  .catch(() => {
    tripController.setNoLoading();
    addButtonComponent.enableElement();
  });
