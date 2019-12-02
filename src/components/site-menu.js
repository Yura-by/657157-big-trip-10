const createLinks = (list) => {
  return list.
  map((linkName) => {
    let name = linkName;
    name = linkName[0].toUpperCase() + name.slice(1);
    return (
      `<a class="trip-tabs__btn" href="#">${name}</a>`
    )
  }).join(`\n`);
};

export const createSiteMenuTemplate = (list) => {
  const linksItems = list.length > 0 ? createLinks(list) : ``;
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${linksItems}
    </nav>`
  );
};
