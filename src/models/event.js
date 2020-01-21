export default class Event {
  constructor(point) {
    this.id = point[`id`];
    this.type = point[`type`];
    this.startDate = new Date(point[`date_from`]);
    this.endDate = new Date(point[`date_to`]);
    this.price = point[`base_price`];
    this.isFavorite = Boolean(point[`is_favorite`]);
    this.offers = point[`offers`] ? point[`offers`] : [];
    this.destination = point[`destination`];
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'base_price': this.price,
      'date_from': this.startDate.toISOString(),
      'date_to': this.endDate.toISOString(),
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'destination': this.destination
    };
  }

  static parsePoint(point) {
    return new Event(point);
  }

  static parsePoints(point) {
    return point.map(Event.parsePoint);
  }

  static clone(point) {
    return new Event(point.toRAW());
  }

  static toRawFromCustom(point) {
    return {
      'type': point[`type`],
      'base_price': point[`price`],
      'date_from': point[`startDate`],
      'date_to': point[`endDate`],
      'is_favorite': point[`isFavorite`],
      'offers': point[`offers`],
      'destination': point[`destination`]
    };
  }
}
