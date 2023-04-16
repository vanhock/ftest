import Renderer from '../modules/Renderer';
import { TrainerWords } from '../modules/TrainerModule';

class TrainerComponent extends Renderer<TrainerWords> {
  constructor(container: Element, props: TrainerWords) {
    super(container, props);
  }

  public template(): string {
    return `
          <div class="user">
            <h3>Example of data</h3>
            <div>${this.props[0]}</div>    
          </div>
        `;
  }
}

export default TrainerComponent;
