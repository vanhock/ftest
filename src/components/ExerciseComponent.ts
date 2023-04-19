import ExerciseModule from '../modules/ExerciseModule';
import LetterComponent from '../components/LetterComponent';
import { answerClass, letterClass } from '../constants';

class ExerciseComponent {
  private readonly exerciseModule: ExerciseModule;

  constructor(exerciseModule: ExerciseModule) {
    this.exerciseModule = exerciseModule;
  }

  public template(): string {
    return `
        <div>
            <div id="answer" class="bg-light mx-1 mb-3" style="display: flex; justify-content: center; align-items: center; height: 46px; border-radius: 6px">
                ${this.answerList()}
            </div>
            <div id="letters">  
               ${this.letterList()}
            </div>    
        </div>`;
  }

  letterList() {
    return this.exerciseModule.randomLetters
      .map((text, index) =>
        new LetterComponent({
          text,
          index,
          class: `btn-primary ${letterClass}`,
        }).template()
      )
      .join('');
  }

  answerList() {
    return this.exerciseModule.guessedLetters
      .map((text, index) =>
        new LetterComponent({
          text,
          index,
          tabIndex: -1,
          class: `${
            this.exerciseModule.isQuestionFailed ? 'btn-danger' : 'btn-success'
          } ${answerClass}`,
        }).template()
      )
      .join('');
  }
}

export default ExerciseComponent;
