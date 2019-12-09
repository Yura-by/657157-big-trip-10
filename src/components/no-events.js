import AbstractComponent from './abstract-component.js';

const createNoEventsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoEventsComponent extends AbstractComponent {
  getTemplate() {
    return createNoEventsTemplate();
  }
}
