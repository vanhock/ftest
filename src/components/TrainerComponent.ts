import Renderer from '../components/Renderer';
import ExerciseComponent from './ExerciseComponent';
import ExerciseModule from '../modules/ExerciseModule';


class TrainerComponent extends Renderer<any> {
  private readonly exerciseModule: ExerciseModule;
  private exerciseComponent: ExerciseComponent;

  constructor(container: Element, props: any) {
    super(container, props);
    // set-up exercise
    this.exerciseModule = new ExerciseModule({ onQuestionUpdate: this.render.bind(this) });
    this.exerciseComponent = new ExerciseComponent(this.exerciseModule);
  }

  public template(): string {
    return `
          <div class="container py-5">
              <div class="d-flex flex-column align-items-center w-100 text-center mx-auto">
                ${!this.exerciseModule.isFinished ? `
                    <h2 class="mb-5">English Vocabulary Trainer</h2>
                    <p class="lead mb-1">Form a valid English word using the given letters</p>
                    <p class="mb-5">Question <span id="current_question">
                        ${this.exerciseModule.currentQuestion}</span> of 
                        <span id="total_questions">${this.exerciseModule.questionsCount}</span>
                    </p>
                    ${this.exerciseComponent.template()}
                ` : `
                    <h2 class="mb-5">Results:</h2>
                    <p>Guessed words without errors: ${this.exerciseModule.wordsWithNoErrorsCount}</p>
                    <p>Errors total: ${this.exerciseModule.errorsCount}</p>
                    <p>Word with max erorrs: ${this.exerciseModule.wordWithMaxErrors}</p>
                `}
              </div>
          </div>
        `;
  }

  private handleLetterClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const letter = target.innerHTML;
    const result = this.exerciseModule.guessLetter(letter.trim());
    if (result) {
      this.render();
    }
  }

  protected addEventListeners?(): void {
    const els = document.querySelectorAll('.letter');
    els.forEach((el) => {
      el.addEventListener('click', this.handleLetterClick)
    })
  }
  protected removeEventListeners?(): void {
    const els = document.querySelectorAll('.letter');
    els.forEach((el) => {
      el.removeEventListener('click', this.handleLetterClick)
    })
  }
}

export default TrainerComponent;
