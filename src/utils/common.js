import moment from "moment";
import {DestinationsInformation, OffersByType, SortType} from "../const.js";

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * HOURS_IN_DAY;
const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * HOURS_IN_DAY;
export const MILLISECONDS_IN_WEEK = DAYS_IN_WEEK * MILLISECONDS_IN_DAY;

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD/MM/YY`);
};

export const getDuration = (startDate, endDate) => {
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);
  return moment.duration(endMoment.diff(startMoment));
};

const formatDuration = (duration) => {
  const durationInSeconds = duration.as(`seconds`);
  const durationInMinutes = castTimeFormat(duration.get(`minutes`));
  const durationInHours = castTimeFormat(duration.get(`hours`));
  const durationInDays = castTimeFormat(duration.get(`days`));

  let formattedDuration = ``;

  if (durationInSeconds < SECONDS_IN_HOUR) {
    formattedDuration = `${durationInMinutes}M`;
  } else if (durationInSeconds >= SECONDS_IN_HOUR && durationInSeconds < SECONDS_IN_DAY) {
    formattedDuration = `${durationInHours}H ${durationInMinutes}M`;
  } else {
    formattedDuration = `${durationInDays}D ${durationInHours}H ${durationInMinutes}M`;
  }

  return formattedDuration;
};

export const formatDurationFromDates = (startDate, endDate) => {
  const duration = getDuration(startDate, endDate);
  return formatDuration(duration);
};

export const formatDurationString = (durationToParse) => {
  const duration = moment.duration(durationToParse);
  return formatDuration(duration);
};

export const capitalize = (text) => {
  if (typeof text !== `string`) {
    return ``;
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getOffersByType = (currentEventType) => {
  const offersByType = OffersByType.offers;
  let offersForCurrentType = [];
  for (const {type, offers} of offersByType) {
    if (type === currentEventType) {
      offersForCurrentType = offersForCurrentType.concat(offers);
      break;
    }
  }

  return offersForCurrentType;
};

export const getDestinationInformation = (destinationName) => {
  const destinations = DestinationsInformation.destinations;
  for (const destinationElement of destinations) {
    if (destinationElement.name === destinationName) {
      return destinationElement;
    }
  }

  return null;
};

export const getDestinations = () => {
  return DestinationsInformation.destinations.map((destinationsItem) => {
    return destinationsItem.name;
  });
};

export const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const allEvents = events.slice();

  switch (sortType) {
    case SortType.SORT_EVENT:
      sortedEvents = allEvents.sort((a, b) => {
        return a.time.startTime - b.time.startTime;
      });
      break;
    case SortType.SORT_TIME:
      sortedEvents = allEvents.sort((a, b) => {
        return (b.time.endTime - b.time.startTime) - (a.time.endTime - a.time.startTime);
      });
      break;
    case SortType.SORT_PRICE:
      sortedEvents = allEvents.sort((a, b) => {
        return b.price - a.price;
      });
      break;
  }

  return sortedEvents;
};
