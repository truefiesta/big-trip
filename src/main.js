import {render, RenderPosition} from "./utils.js";
import InfoSectionComponent from "./components/info-section.js";
import InfoComponent from "./components/info.js";
import CostComponent from "./components/cost.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import NoEventsComponent from "./components/no-events.js";
import SortComponent from "./components/sort.js";
import DaysComponent from "./components/days.js";
import {generateEvents} from "./mock/event.js";
import {renderDaysWithEvents} from "./render/events.js";

const EVENTS_COUNT = 20;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFilterHeaderElement = tripControlsElement.querySelector(`h2:nth-of-type(2)`);

const events = generateEvents(EVENTS_COUNT);

render(tripControlsFilterHeaderElement, new MenuComponent().getElement(), RenderPosition.BEFORE);
render(tripControlsElement, new FilterComponent().getElement(), RenderPosition.BEFOREEND);
render(tripControlsElement, new InfoSectionComponent().getElement(), RenderPosition.BEFORE);

const tripMainInfoSectionElement = tripMainElement.querySelector(`.trip-info`);
render(tripMainInfoSectionElement, new InfoComponent().getElement(), RenderPosition.BEFOREEND);
render(tripMainInfoSectionElement, new CostComponent().getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripEventsHeaderElement = tripEventsElement.querySelector(`h2`);

if (events.length > 0) {
  render(tripEventsHeaderElement, new SortComponent().getElement(), RenderPosition.AFTER);
  const tripDaysComponent = new DaysComponent();
  render(tripEventsElement, tripDaysComponent.getElement(), RenderPosition.BEFOREEND);
  renderDaysWithEvents(tripDaysComponent, events);
} else {
  render(tripEventsHeaderElement, new NoEventsComponent().getElement(), RenderPosition.AFTER);
}
