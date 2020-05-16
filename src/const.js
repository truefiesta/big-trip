export const destinations = [
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`
];

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

export const offers = [
  {
    type: `luggage`,
    title: `Add luggage`,
    price: 30
  },
  {
    type: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  },
  {
    type: `meal`,
    title: `Add meal`,
    price: 15
  },
  {
    type: `seats`,
    title: `Choose seats`,
    price: 5
  },
  {
    type: `train`,
    title: `Travel by train`,
    price: 40
  }
];

export const offersByType = {
  "taxi": [
    {
      type: `luggage`,
      title: `Add luggage`,
      price: 30
    },
    {
      type: `comfort`,
      title: `Switch to comfort class`,
      price: 100
    }
  ],
  "bus": [
    {
      type: `luggage`,
      title: `Add luggage`,
      price: 30
    },
    {
      type: `comfort`,
      title: `Switch to comfort class`,
      price: 100
    },
    {
      type: `seats`,
      title: `Choose seats`,
      price: 5
    }
  ],
  "train": [
    {
      type: `luggage`,
      title: `Add luggage`,
      price: 30
    },
    {
      type: `comfort`,
      title: `Switch to comfort class`,
      price: 100
    },
    {
      type: `meal`,
      title: `Add meal`,
      price: 15
    },
    {
      type: `seats`,
      title: `Choose seats`,
      price: 5
    },
    {
      type: `train`,
      title: `Travel by train`,
      price: 40
    }
  ],
  "ship": [
    {
      type: `luggage`,
      title: `Add luggage`,
      price: 30
    },
    {
      type: `comfort`,
      title: `Switch to comfort class`,
      price: 100
    },
    {
      type: `meal`,
      title: `Add meal`,
      price: 15
    },
    {
      type: `seats`,
      title: `Choose seats`,
      price: 5
    }
  ],
  "transport": [
    {
      type: `luggage`,
      title: `Add luggage`,
      price: 30
    },
    {
      type: `comfort`,
      title: `Switch to comfort class`,
      price: 100
    },
    {
      type: `seats`,
      title: `Choose seats`,
      price: 5
    },
    {
      type: `train`,
      title: `Travel by train`,
      price: 40
    }
  ],
  "drive": [
    {
      type: `comfort`,
      title: `Switch to comfort class`,
      price: 100
    }
  ],
  "flight": [
    {
      type: `luggage`,
      title: `Add luggage`,
      price: 30
    },
    {
      type: `comfort`,
      title: `Switch to comfort class`,
      price: 100
    },
    {
      type: `seats`,
      title: `Choose seats`,
      price: 5
    },
    {
      type: `meal`,
      title: `Add meal`,
      price: 15
    }
  ],
  "check-in": [
    {
      type: `comfort`,
      title: `Switch to comfort class`,
      price: 100
    },
    {
      type: `luggage`,
      title: `Add luggage`,
      price: 30
    },
  ],
  "sightseeing": [
    {
      type: `train`,
      title: `Travel by train`,
      price: 40
    }
  ],
  "restaurant": [
    {
      type: `seats`,
      title: `Choose seats`,
      price: 5
    },
    {
      type: `meal`,
      title: `Add meal`,
      price: 15
    }
  ]
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

export const EVENT_TYPES = Object.values(EventType);
