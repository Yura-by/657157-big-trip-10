export default class Store {
  constructor(storage, keyEvents, keyDestinations, keyOffers) {
    this._storage = storage;
    this._storeKey = keyEvents;
    this._destinationsKey = keyDestinations;
    this._offersKey = keyOffers;
  }

  getAll() {}

  setItem(key, value) {}

  removeItem(key) {}
}
