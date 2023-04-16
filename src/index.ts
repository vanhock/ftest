import App from './components/App';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#app');

  if (container) {
    const app = new App(container);
    app.render();
  }
});
