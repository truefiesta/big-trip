import moment from "moment";
import {FilterType} from "../const.js";

export const getFutureEvents = (events) => {
  const today = moment();
  return events.filter((event) => {
    const {startTime} = event.time;
    const startMoment = moment(startTime);
    return today.isBefore(startMoment, `day`);
  });
};

export const getPastEvents = (events) => {
  const today = moment();
  return events.filter((event) => {
    const {endTime} = event.time;
    const endMoment = moment(endTime);
    return today.isAfter(endMoment, `day`);
  });
};

export const getEventsByFilter = (events, filterType) => {
  switch (filterType) {
    case FilterType.All:
      return events;
    case FilterType.FUTURE:
      return getFutureEvents(events);
    case FilterType.PAST:
      return getPastEvents(events);
  }

  return events;
};
