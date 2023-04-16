import TrainerModule, { TrainerWords } from '../modules/TrainerModule';
import TrainerComponent from '../components/TrainerComponent';

class App {
  private readonly trainerModule: TrainerModule;
  private trainerComponent: TrainerComponent;

  constructor(container: Element) {
    const wordsData: TrainerWords = [
      'apple',
      'function',
      'timeout',
      'task',
      'application',
      'data',
      'tragedy',
      'sun',
      'symbol',
      'button',
      'software',
    ];

    this.trainerModule = new TrainerModule(wordsData);
    this.trainerComponent = new TrainerComponent(
      container,
      this.trainerModule.getAll()
    );
  }

  public render() {
    this.trainerComponent.render();
  }
}

export default App;
