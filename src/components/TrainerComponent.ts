import Renderer from '../modules/Renderer';
import ExerciseComponent from './ExerciseComponent';
import ExerciseModule from '../modules/ExerciseModule';
import {
  dismissModalSelector,
  letterClass,
  restoreModalSelector,
} from '../constants';
import RestoreModal from '../components/RestoreModal';

class TrainerComponent extends Renderer<any> {
  private readonly exerciseModule: ExerciseModule;
  private exerciseComponent: ExerciseComponent;
  private restoreModalComponent: RestoreModal;
  private showModal: boolean = true;

  constructor(container: Element, props: any) {
    super(container, props);
    // set-up exercise
    this.exerciseModule = new ExerciseModule({
      onQuestionUpdate: this.handleQuestionUpdate,
      onQuestionFail: this.handleQuestionFail,
    });
    this.exerciseComponent = new ExerciseComponent(this.exerciseModule);
    this.restoreModalComponent = new RestoreModal();
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
              ${
                this.showRestoreModal()
                  ? this.restoreModalComponent.template()
                  : ''
              }
          </div>
        `;
  }

  private handleQuestionUpdate = (): void => {
    this.render.apply(this);
  };

  private handleQuestionFail = (): void => {
    this.render.apply(this);
  };

  private handleRestoreData = (): void => {
    this.exerciseModule.restoreSavedData();
    this.exerciseModule.clearSavedData();
    this.showModal = false;
    this.render();
  };

  private handleDismissModal = (): void => {
    this.exerciseModule.clearSavedData();
    this.showModal = false;
    this.render();
  };

  private handleKeyDown = (event: KeyboardEventInit): void => {
    let index = -1;
    let elementToHighlight = null;
    const { key } = event;

    // Process only letters
    if (!/^[a-zA-Z]$/.test(`${key}`)) {
      return;
    }

    const letters = this.container.querySelectorAll(`.${letterClass}`);

    // find matched with first letter and pressed key
    for (let i = 0; i < letters.length; i++) {
      if (letters[i].innerHTML.trim() === key) {
        index = i;
        elementToHighlight = letters[i];
        break;
      }
    }

    const result = this.exerciseModule.guessLetter(index);
    if (result) {
      this.render();
    } else {
      if (elementToHighlight instanceof HTMLElement) {
        this.makeAnimation(elementToHighlight, 'btn-danger', 3);
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

  private showRestoreModal(): boolean {
    return (
      this.exerciseModule.currentQuestion === 1 &&
      this.exerciseModule.hasSavedData &&
      this.showModal
    );
  }

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
    const els = document.querySelectorAll(`.${letterClass}`);
    els.forEach((el) => {
      el.addEventListener('click', this.handleLetterClick);
    });
    document.addEventListener('keydown', this.handleKeyDown);
    if (this.exerciseModule.hasSavedData) {
      const restore = document.querySelector(restoreModalSelector);
      if (restore) restore.addEventListener('click', this.handleRestoreData);
      const dismissEls = document.querySelectorAll(dismissModalSelector);
      dismissEls.forEach((el) =>
        el.addEventListener('click', this.handleDismissModal)
      );
    }
  }
  protected removeEventListeners?(): void {
    const els = document.querySelectorAll(`.${letterClass}`);
    els.forEach((el) => {
      el.removeEventListener('click', this.handleLetterClick);
    });
    document.removeEventListener('keydown', this.handleKeyDown);

    if (this.exerciseModule.hasSavedData) {
      const restore = document.querySelector(restoreModalSelector);
      if (restore) restore.removeEventListener('click', this.handleRestoreData);
      const dismissEls = document.querySelectorAll(dismissModalSelector);
      dismissEls.forEach((el) =>
        el.removeEventListener('click', this.handleDismissModal)
      );
    }
  }
}

export default TrainerComponent;
