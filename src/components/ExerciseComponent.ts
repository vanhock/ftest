import ExerciseModule from '../modules/ExerciseModule';
import LetterComponent from '../components/LetterComponent';
import {answerClass, letterClass} from '../constants';

class ExerciseComponent {
  private readonly exerciseModule: ExerciseModule;

  constructor(exerciseModule: ExerciseModule) {
    this.exerciseModule = exerciseModule;
  }

  public template(): string {
    return `<div>
                <div id="answer" class="bg-light mx-1 mb-3" style="height: 46px; border-radius: 6px">
                    ${this.answerList()}
                </div>
                <div id="letters">  
                   ${this.letterList()}
                </div>    
            </div>`;
  }


  letterList() {
    return this.exerciseModule.randomLetters
      .map(
        (text) => new LetterComponent({
            text,
            class: `btn-primary ${letterClass}`,
          }).template())
      .join('');
  }

  answerList() {
    return this.exerciseModule.guessedLetters
        .map(
            (text) => new LetterComponent({
              text,
              class: `btn-primary ${answerClass}`,
            }).template())
        .join('');
  }
}

export default ExerciseComponent;
