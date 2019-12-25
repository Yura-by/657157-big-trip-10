const TYPE = {
  BUS: `bus`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
  TRAIN: `train`,
  TRANSPORT: `transport`,
  SHIP: `ship`,
  TAXI: `taxi`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`,
  CHECK: `check`
};

const TYPES = [
  TYPE.BUS,
  TYPE.DRIVE,
  TYPE.FLIGHT,
  TYPE.TRAIN,
  TYPE.TRANSPORT,
  TYPE.SHIP,
  TYPE.TAXI,
  TYPE.SIGHTSEEING,
  TYPE.RESTAURANT,
  TYPE.CHECK
];

const Index = {
  START_PRETEX_IN: 8,
  UPPERCASE_LETTER: 0,
  DRAIN_LETTER: 1
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const HIDDEN_CLASS = `visually-hidden`;

export {TYPES, TYPE, Index, FilterType, HIDDEN_CLASS};
