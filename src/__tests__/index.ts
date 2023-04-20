import ExerciseModule from '../modules/ExerciseModule';
import HistoryMock from "./HistoryMock";
import LocalStorageMock from "./LocalStorageMock";

(global as any).localStorage = new LocalStorageMock();
(global as any).history = new HistoryMock();

// FYI: This is just an example of tests -->

describe('ExerciseModule', () => {
  let exercise: ExerciseModule;
  const onQuestionUpdate = jest.fn();
  const onQuestionFail = jest.fn();

  beforeEach(() => {
    exercise = new ExerciseModule({ onQuestionUpdate, onQuestionFail });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a new question at start', () => {
    expect(exercise.currentQuestion).toEqual(1);
    expect(exercise.randomLetters.length).toEqual(
      exercise.currentWordArray.length
    );
  });

  it('should save data to local storage after the second question', () => {
    exercise.newQuestion(); // Next question
    expect(exercise.hasSavedData).toBeTruthy();
  });

  it('should restore saved data from local storage', () => {
    localStorage.setItem(
      'exerciseLocalStorageKey',
      JSON.stringify({ currentQuestion: 2 })
    );
    exercise.restoreSavedData();
    expect(exercise.currentQuestion).toEqual(2);
  });

  it('should clear saved data from local storage', () => {
    localStorage.setItem(
      'exerciseLocalStorageKey',
      JSON.stringify({ currentQuestion: 2 })
    );
    exercise.clearSavedData();
    expect(localStorage.getItem('exerciseLocalStorageKey')).toBeNull();
  });

  it('should update onQuestionUpdate when a letter is guessed correctly', () => {
    exercise.newQuestion();
    const correctLetterIndex = exercise.currentWordArray.findIndex(
      (letter) => !exercise.guessedLetters.includes(letter)
    );
    const guess = exercise.guessLetter(correctLetterIndex);
    expect(guess).toBeTruthy();
    expect(onQuestionUpdate).toHaveBeenCalledTimes(1);
  });

  it('should update onQuestionFail when max tries are exceeded', () => {
    exercise.newQuestion();
    const incorrectLetterIndex = exercise.randomLetters.findIndex(
      (letter) => !exercise.currentWordArray.includes(letter)
    );
    for (let i = 0; i < exercise.maxTries; i++) {
      exercise.guessLetter(incorrectLetterIndex);
    }
    expect(onQuestionFail).toHaveBeenCalledTimes(1);
  });
});
