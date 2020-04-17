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
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  BEFORE: `before`,
  AFTER: `after`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTER:
      container.after(element);
      break;
    case RenderPosition.BEFORE:
      container.before(element);
      break;
  }
};

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatDate = (date) => {
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth());
  const year = date.getFullYear();

  const twoDigitsYear = year.toString().slice(2);

  const time = formatTime(date);

  return `${day}/${month}/${twoDigitsYear} ${time}`;
};

export const formatDuration = (durationInMilliseconds) => {
  let formatedDuration = ``;
  const durationInSeconds = durationInMilliseconds / 1000;

  const days = Math.floor(durationInSeconds / SECONDS_IN_DAY);
  const daysReminder = durationInSeconds % SECONDS_IN_DAY;

  const hours = Math.floor(daysReminder / SECONDS_IN_HOUR);
  const hoursReminder = daysReminder % SECONDS_IN_HOUR;

  const minutes = Math.floor(hoursReminder / SECONDS_IN_MINUTE);

  if (durationInSeconds < SECONDS_IN_HOUR) {
    formatedDuration = `${castTimeFormat(minutes)}M`;
  } else if (durationInSeconds >= SECONDS_IN_HOUR && durationInSeconds < SECONDS_IN_DAY) {
    formatedDuration = `${castTimeFormat(hours)}H ${castTimeFormat(minutes)}M`;
  } else {
    formatedDuration = `${castTimeFormat(days)}D ${castTimeFormat(hours)}H ${castTimeFormat(minutes)}M`;
  }

  return formatedDuration;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
