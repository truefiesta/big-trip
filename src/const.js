export const MONTH_NAMES = [
  `JAN`,
  `FEB`,
  `MAR`,
  `APR`,
  `MAY`,
  `JUN`,
  `JUL`,
  `AUG`,
  `SEP`,
  `OCT`,
  `NOV`,
  `DEC`,
];

export const OffersByType = {
  offer: []
};

export const DestinationsInformation = {
  destinations: []
};

export const ESC_KEY = `Esc`;
export const ESCAPE_KEY = `Escape`;

export const SortType = {
  SORT_EVENT: `sort-event`,
  SORT_TIME: `sort-time`,
  SORT_PRICE: `sort-price`
};

export const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const transferTypes = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`
];

export const activityTypes = [
  `check-in`,
  `sightseeing`,
  `restaurant`
];

export const EventType = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
  CHECK: `check-in`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`
};

export const eventTypeIcons = {
  [EventType.TAXI]: `🚕`,
  [EventType.BUS]: `🚌`,
  [EventType.TRAIN]: `🚂`,
  [EventType.SHIP]: `🛳️`,
  [EventType.TRANSPORT]: `🚊`,
  [EventType.DRIVE]: `🚗`,
  [EventType.FLIGHT]: `✈️`,
  [EventType.CHECK]: `🏨`,
  [EventType.SIGHTSEEING]: `🏛️`,
  [EventType.RESTAURANT]: `🍴`
};

export const EVENT_TYPES = Object.values(EventType);

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`
};

export const HIDDEN_CLASS = `visually-hidden`;
