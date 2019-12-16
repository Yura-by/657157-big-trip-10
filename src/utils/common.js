import moment from 'moment';

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatInDay = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

export const formatInTime = (date) => {
  return moment(date).format(`HH:mm`);
};
