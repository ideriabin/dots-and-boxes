import './app.css';
import './field.css';

document.addEventListener('DOMContentLoaded', onInit);

function onInit() {
  setVersion();
}

function setVersion() {
  document.querySelector('.app-version').innerText = `v${VERSION}`;
}
