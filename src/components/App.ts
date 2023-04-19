import TrainerComponent from '../components/TrainerComponent';

class App {
  private trainerComponent: TrainerComponent;

  constructor(container: Element) {
    this.trainerComponent = new TrainerComponent(
      container, {}
    );
  }

  public render() {
    this.trainerComponent.render();
  }
}

export default App;
