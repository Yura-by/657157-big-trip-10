const HIDDEN_CLASS = `visually-hidden`;

const Type = {
  BUS: `bus`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
  TRAIN: `train`,
  TRANSPORT: `transport`,
  SHIP: `ship`,
  TAXI: `taxi`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`,
  CHECK: `check-in`
};

const TYPES_TRANSPORT = [
  Type.BUS,
  Type.DRIVE,
  Type.FLIGHT,
  Type.TRAIN,
  Type.TRANSPORT,
  Type.SHIP,
  Type.TAXI
];

const TYPES_PLACE = [
  Type.SIGHTSEEING,
  Type.RESTAURANT,
  Type.CHECK
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

export {TYPES_TRANSPORT, TYPES_PLACE, Type, Index, FilterType, HIDDEN_CLASS};
