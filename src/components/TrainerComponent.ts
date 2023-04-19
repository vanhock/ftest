import Renderer from '../modules/Renderer';
import ExerciseComponent from './ExerciseComponent';
import ExerciseModule from '../modules/ExerciseModule';
import { letterClass } from '../constants';

class TrainerComponent extends Renderer<any> {
  private readonly exerciseModule: ExerciseModule;
  private exerciseComponent: ExerciseComponent;

  constructor(container: Element, props: any) {
    super(container, props);
    // set-up exercise
    this.exerciseModule = new ExerciseModule({
      onQuestionUpdate: this.handleQuestionUpdate,
      onQuestionFail: this.handleQuestionFail,
    });
    this.exerciseComponent = new ExerciseComponent(this.exerciseModule);
  }

  public template(): string {
    return `
          <div class="container py-5">
              <div class="d-flex flex-column align-items-center w-100 text-center mx-auto">
                ${
                  !this.exerciseModule.isFinished
                    ? `
                    <h2 class="mb-5">English Vocabulary Trainer</h2>
                    <p class="lead mb-1">Form a valid English word using the given letters</p>
                    <p class="mb-5">Question <span id="current_question">
                        ${this.exerciseModule.currentQuestion}</span> of 
                        <span id="total_questions">${
                          this.exerciseModule.questionsCount
                        }</span>
                    </p>
                    ${this.exerciseComponent.template()}
                `
                    : `
                    <h2 class="mb-5">Results:</h2>
                    <p>Guessed words without errors: ${this.exerciseModule.wordsWithNoErrorsCount}</p>
                    <p>Errors total: ${this.exerciseModule.errorsCount}</p>
                    <p>Word with max erorrs: ${this.exerciseModule.wordWithMaxErrors}</p>
                `
                }
              </div>
          </div>
        `;
  }

  private handleQuestionUpdate = (): void => {
    this.render.apply(this);
  };

  private handleQuestionFail = (): void => {
    this.render.apply(this);
  };

  private handleKeyDown = (event: KeyboardEventInit): void => {
    const { key } = event;
    const result = this.exerciseModule.guessLetter(0, key);
    if (result) {
      this.render();
    } else {
      const letters = this.container.querySelectorAll(`.${letterClass}`);
      let element;
      for (let i = 0; i < letters.length; i++) {
        if (letters[i].innerHTML.trim() === key) {
          element = letters[i];
          break;
        }
      }
      if (element instanceof HTMLElement) {
        this.makeAnimation(element, 'btn-danger', 3);
      }
    }
  };

  private handleLetterClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const index = target.getAttribute('data-index') || '0';
    const result = this.exerciseModule.guessLetter(parseInt(index));
    if (result) {
      this.render();
    } else {
      if (event.target instanceof HTMLElement) {
        this.makeAnimation(event.target, 'btn-danger', 3);
      }
    }
  };

  private makeAnimation(
    element: HTMLElement,
    className: string,
    repeatTimes: number
  ): void {
    let count = 0;
    const interval = setInterval(() => {
      if (count > repeatTimes) {
        clearInterval(interval);
      }
      element.classList.add(className);
      setTimeout(() => {
        element.classList.remove(className);
      }, 200);
      count++;
    }, 100);
  }

  protected addEventListeners?(): void {
    const els = document.querySelectorAll('.letter');
    els.forEach((el) => {
      el.addEventListener('click', this.handleLetterClick);
    });
    document.addEventListener('keydown', this.handleKeyDown);
  }
  protected removeEventListeners?(): void {
    const els = document.querySelectorAll('.letter');
    els.forEach((el) => {
      el.removeEventListener('click', this.handleLetterClick);
    });
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}

export default TrainerComponent;
