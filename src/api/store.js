export default class Store {
  constructor(storage, keyEvents, keyDestinations, keyOffers) {
    this._storage = storage;
    this._storeKey = keyEvents;
    this._destinationsKey = keyDestinations;
    this._offersKey = keyOffers;
  }

  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey));
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getAll();
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        )
    );
  }

  setDestinations(destinations) {
    this._storage.setItem(
        this._destinationsKey,
        JSON.stringify(destinations)
    );
  }

  getDestinations() {
    try {
      return JSON.parse(this._storage.getItem(this._destinationsKey));
    } catch (err) {
      return {};
    }
  }

  setOffers(offers) {
    this._storage.setItem(
        this._offersKey,
        JSON.stringify(offers)
    );
  }

  getOffers() {
    try {
      return JSON.parse(this._storage.getItem(this._offersKey));
    } catch (err) {
      return {};
    }
  }

  removeItem(key) {
    const store = this.getAll();
    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }

  clear() {
    this._storage.clear();
  }
}
