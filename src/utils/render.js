export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  INSERT_BEFORE: `insertBefore`
};

const TAG_NAME = `div`;

export const createElement = (template) => {
  const newElement = document.createElement(TAG_NAME);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, component, place, referenceElement) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.INSERT_BEFORE:
      container.insertBefore(component.getElement(), referenceElement);
      break;
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
