import {Types} from '../const.js';

const Photo = {
  MIN: 1,
  MAX: 5
};

const Senstense = {
  MIN: 1,
  MAX: 3
};

const Day = {
  MIN: 0,
  MAX: 10
};

const Price = {
  MIN: 1,
  MAX: 10000
};

const OffersLength = {
  MIN: 0,
  MAX: 2
};

const OFFERS = [
  {
    desription: `Add luggage`,
    add: `+10`,
    currency: `€`
  },
  {
    desription: `Switch to comfort class`,
    add: `+150`,
    currency: `€`
  },
  {
    desription: `Add meal`,
    add: `+2`,
    currency: `€`
  },
  {
    desription: `Choose seats`,
    add: `+9`,
    currency: `€`
  }
];

const CITIES = [
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`
];

const SENTENCES_DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
  `Cras aliquet varius magna, non porta ligula feugiat eget. `,
  `Fusce tristique felis at fermentum pharetra. `,
  `Aliquam id orci ut lectus varius viverra. `,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. `,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. `,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. `,
  `Sed sed nisi sed augue convallis suscipit in sed felis. `,
  `Aliquam erat volutpat. `,
  `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. `
];

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const generateRandomPhotos = () => {
  return new Array(getRandomIntegerNumber(Photo.MIN, Photo.MAX)).
  fill(``).
  map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const generateRandomDescription = () => {
  return new Array(getRandomIntegerNumber(Senstense.MIN, Senstense.MAX)).
  fill(``).
  map(() => getRandomArrayItem(SENTENCES_DESCRIPTION)).join(``);
};

const generateRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(Day.MIN, Day.MAX);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateRandomPrice = () => {
  return getRandomIntegerNumber(Price.MIN, Price.MAX);
};

const generateRandomOffers = () => {
  return new Array(getRandomIntegerNumber(OffersLength.MIN, OffersLength.MAX)).
  fill(``).map(() => getRandomArrayItem(OFFERS));
};

const generateEvent = () => {

  return {
    type: getRandomArrayItem(Types),
    city: getRandomArrayItem(CITIES),
    photo: generateRandomPhotos(),
    description: generateRandomDescription(),
    date: generateRandomDate(),
    price: generateRandomPrice(),
    offers: generateRandomOffers()
  };
};

console.log(generateEvent());
