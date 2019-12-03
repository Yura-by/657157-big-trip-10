const createImagesItems = (photos) => {
  return photos.
  map((soursePhoto) => {
    return (
      `<img class="event__photo" src="${soursePhoto}" alt="Event photo">`
    );
  }).join(`\n`);
};

const createImagesTemplate = (photo) => {
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${createImagesItems(photo)}
      </div>
    </div>`
  );
};

export const createEventDestionationTemplate = (event) => {
  const {description, photo} = event;
  const descriptionImages = photo.length > 0 ? createImagesTemplate(photo) : ``;
  return description.length > 0 ? (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${descriptionImages}
    </section>`
  )
    : ``;
};
