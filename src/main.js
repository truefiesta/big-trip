import {render} from "./utils.js";
import {createTripMainInfoSectionElement} from "./components/info.js";
import {createTripMainInfoElement} from "./components/info.js";
import {createTripInfoCostElement} from "./components/cost.js";
import {createSiteMenuTemplate} from "./components/menu.js";
import {createSiteFilterTemplate} from "./components/filter.js";
import {createTripSortTemplate} from "./components/sorting.js";
import {createTripDaysTemplate} from "./components/days.js";
import {createTripEventEditFormTemplate} from "./components/event-edit.js";
import {generateEvents} from "./mock/event.js";
import {renderDaysWithEvents} from "./render/events.js";

const EVENTS_COUNT = 20;
const events = generateEvents(EVENTS_COUNT);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFilterHeaderElement = tripControlsElement.querySelector(`h2:nth-of-type(2)`);

render(tripControlsFilterHeaderElement, createSiteMenuTemplate(), `beforebegin`);
render(tripControlsElement, createSiteFilterTemplate(), `beforeend`);
render(tripControlsElement, createTripMainInfoSectionElement(), `beforebegin`);

const tripMainInfoSectionElement = tripMainElement.querySelector(`.trip-info`);
render(tripMainInfoSectionElement, createTripMainInfoElement(), `beforeend`);
render(tripMainInfoSectionElement, createTripInfoCostElement(), `beforeend`);

const tripEventsElement = document.querySelector(`.trip-events`);
const tripEventsHeaderElement = tripEventsElement.querySelector(`h2`);

render(tripEventsHeaderElement, createTripSortTemplate(), `afterend`);
render(tripEventsElement, createTripEventEditFormTemplate(events[0]), `beforeend`);

render(tripEventsElement, createTripDaysTemplate(), `beforeend`);

const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);
renderDaysWithEvents(tripDaysElement, events.slice(1));
