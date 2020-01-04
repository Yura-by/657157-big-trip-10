export default class Event {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`];
    this.destination = data[`destination`];
  }

  toRAW() {
    return {
      id: this.id,
      type: this.type,
      base_price: this.price,
      date_from: this.startDate.toISOString(),
      date_to: this.endDate.toISOString(),
      is_favorite: this.isFavorite,
      offers: this.offers,
      destination: this.destination
    };
  }

  static parseEvent(data) {
    return new Event(data);
  }

  static parseEvents(data) {
    return data.map(Event.parseEvent);
  }

  static clone(data) {
    return new Event(data.toRAW());
  }
}
