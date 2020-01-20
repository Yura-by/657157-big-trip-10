export default class Event {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`] ? data[`offers`] : [];
    this.destination = data[`destination`];
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

  static parsePoint(data) {
    return new Event(data);
  }

  static parsePoints(data) {
    return data.map(Event.parsePoint);
  }

  static clone(data) {
    return new Event(data.toRAW());
  }

  static toRawFromCustom(data) {
    return {
      'type': data[`type`],
      'base_price': data[`price`],
      'date_from': data[`startDate`],
      'date_to': data[`endDate`],
      'is_favorite': data[`isFavorite`],
      'offers': data[`offers`],
      'destination': data[`destination`]
    };
  }
}
