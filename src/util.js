export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  INSERT_BEFORE: `insertBefore`
};

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place, referenceElement) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.INSERT_BEFORE:
      container.insertBefore(element, referenceElement);
      break;
  }
};
