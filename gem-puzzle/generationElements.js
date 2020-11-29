import './styles/scss.scss';

export let generateElement = (
  tagName,
  classList = null,
  textContent = null,
  innerHTML = null,
  src = null,
  dataset = null
) => {
  let element = document.createElement(tagName);
  if (classList) {
    element.classList.add(classList);
  }
  if (textContent) {
    element.textContent = textContent;
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  if (src) {
    element.src = src;
  }
  if (dataset) {
    element.dataset[dataset.key] = dataset.data;
  }
  return element;
};
