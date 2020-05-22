import {MILLISECONDS_IN_WEEK} from "../utils/common.js";
import {destinations, transferTypes, activityTypes, offersByType} from "../const.js";

export const MIN_PHOTOS = 1;
export const MAX_PHOTOS = 5;
export const MIN_DESCRIPTION_PHRASES = 1;
export const MAX_DESCRIPTION_PHRASES = 5;
const MIN_OFFERS = 0;
// const MAX_OFFERS = 5;
const MIN_PRICE = 15;
const MAX_PRICE = 200;

export const destinationDescriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
];

const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length);
  return array[randomIndex];
};

export const getRandomItemsfromArray = (array, min, max) => {

  const arrayLength = getRandomInteger(min, max);
  const newArray = [];

  while (newArray.length < arrayLength) {
    let randomItem = getRandomArrayItem(array);

    if (!newArray.includes(randomItem)) {
      newArray.push(randomItem);
    }

  }
  return newArray;
};

export const getRandomPhotos = (min, max) => {
  const arrayLength = getRandomInteger(min, max);
  const newArray = [];

  while (newArray.length < arrayLength) {
    newArray.push(`http://picsum.photos/248/152?r=${Math.random()};`);
  }

  return newArray;
};

// Ограничение: плюс-минус неделя от текущей даты.
const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomInteger(0, MILLISECONDS_IN_WEEK);

  targetDate.setTime(targetDate.getTime() + diffValue);

  return targetDate;
};

// Дата окончания не может быть меньше даты начала события.
const getRandomDateRange = () => {
  const startDate = getRandomDate();
  const diffValue = getRandomInteger(0, MILLISECONDS_IN_WEEK);
  const endDate = new Date();
  endDate.setTime(startDate.getTime() + diffValue);

  return {
    startDate,
    endDate
  };
};

const photos = [
  {
    "src": `http://picsum.photos/300/200?r=0.0762563005163317`,
    "description": `Chamonix parliament building`
  },
  {
    "src": `http://picsum.photos/300/200?r=0.6737960490195023`,
    "description": `Chamonix building`
  }
];

const allEventTypes = transferTypes.concat(activityTypes);

const generateEvent = () => {
  const description = getRandomItemsfromArray(destinationDescriptions, MIN_DESCRIPTION_PHRASES, MAX_DESCRIPTION_PHRASES).join(` `);
  const type = getRandomArrayItem(allEventTypes);

  // const getSelectedOffers = (currentType, offers) => {
  //   const maxOffers = offers[currentType.toLowerCase()].length;
  //   return getRandomItemsfromArray(offers[currentType.toLowerCase()], MIN_OFFERS, maxOffers);
  // };

  const getSelectedOffers = (currentType) => {
    const offersAndCurrentType = offersByType.filter((offerByType) => offerByType.type === currentType);
    const offers = offersAndCurrentType[0].offers;
    const maxOffers = offers.length;
    return getRandomItemsfromArray(offers, MIN_OFFERS, maxOffers);
  };
  const selectedOffers = getSelectedOffers(type);

  const timeRange = getRandomDateRange();

  return {
    id: String(new Date() + Math.random()),
    type,
    destination: getRandomArrayItem(destinations),
    offers: selectedOffers,
    destinationInfo: {
      description,
      photos
    },
    time: {
      startTime: timeRange.startDate,
      endTime: timeRange.endDate
    },
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    isFavorite: Math.random() > 0.5
  };
};

export const generateEvents = (eventsCount) => {
  return new Array(eventsCount).fill(``).map(generateEvent);
};
