import { exerciseLocalStorageKey } from '../constants';

interface ExerciseProps {
  onQuestionUpdate: Function;
  onQuestionFail: Function;
}

interface ExerciseData {
  usedWords: {
    [key: string]: number; // word: errors count
  };
  tries: number;
  currentQuestion: number;
  currentWord: string;
  randomLetters: string[];
  currentLetterIndex: number;
  guessedLetters: string[];
  isFinished: boolean;
}

interface ExerciseSettings {
  questions: number;
  maxTries: number;
}

class ExerciseModule {
  private readonly allWords: string[] = [
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
  private data: ExerciseData = {
    usedWords: {},
    tries: 0,
    currentQuestion: 0,
    currentWord: '',
    currentLetterIndex: -1,
    randomLetters: [],
    guessedLetters: [],
    isFinished: false,
  };
  private setting: ExerciseSettings = {
    questions: 6,
    maxTries: 3,
  };
  private readonly onQuestionUpdate: Function;
  private readonly onQuestionFail: Function;
  private isShowModal: boolean = false;

  constructor(props: ExerciseProps) {
    this.onQuestionUpdate = props.onQuestionUpdate;
    this.onQuestionFail = props.onQuestionFail;
    this.newQuestion();
    this.setRestoreModalState();
    this.addHistoryListeners();
  }

  get isShowRestoreModal(): boolean {
    return this.isShowModal;
  }

  get isQuestionFailed(): boolean {
    return this.data.usedWords[this.data.currentWord] === 4;
  }

  get isFinished(): boolean {
    return this.data.isFinished;
  }

  get currentQuestion(): number {
    return this.data.currentQuestion;
  }

  get questionsCount(): number {
    return this.setting.questions;
  }

  get randomLetters(): string[] {
    return this.data.randomLetters;
  }

  get guessedLetters(): string[] {
    return this.data.guessedLetters;
  }

  get currentWordArray(): string[] {
    return this.data.currentWord.split('');
  }

  get currentLetterIndex(): number {
    return this.data.currentLetterIndex;
  }

  // For test purposes only
  get maxTries(): number {
    return this.setting.maxTries;
  }

  get hasSavedData(): boolean {
    return !!localStorage.getItem(exerciseLocalStorageKey);
  }

  get errorsCount(): number {
    return Object.values(this.data.usedWords).reduce(
      (acc, value: number) => acc + value,
      0
    );
  }

  get wordWithMaxErrors(): string {
    const values = Object.values(this.data.usedWords);
    const maxErrors = Math.max(...values);
    if (maxErrors === 0) {
      return '-';
    }

    return Object.keys(this.data.usedWords)[values.indexOf(maxErrors)];
  }

  get wordsWithNoErrorsCount(): number {
    return Object.values(this.data.usedWords).reduce((acc, value) => {
      if (!value) ++acc;
      return acc;
    }, 0);
  }

  public guessLetter(index: number): boolean {
    const letter = this.data.randomLetters[index];
    const currentGuess =
      this.data.currentWord[this.data.currentLetterIndex] === letter;

    if (currentGuess) {
      ++this.data.currentLetterIndex;
      this.data.guessedLetters.push(letter);
      this.data.randomLetters.splice(index, 1);
      // If all letters guessed
      if (this.data.currentLetterIndex === this.data.currentWord.length) {
        this.updateHistoryState(true);
        setTimeout(() => {
          this.newQuestion();
          this.onQuestionUpdate();
        }, 500);
      }
    } else {
      ++this.data.tries;
      this.logErrorToCurrentWord();
    }
    // If tries exceeded
    if (this.isQuestionFailed) {
      this.data.guessedLetters = this.currentWordArray;
      this.updateHistoryState(true);
      this.onQuestionFail();
      setTimeout(() => {
        this.newQuestion();
        this.onQuestionUpdate();
      }, 1000);
    }

    this.saveToLocalStorage();

    return currentGuess;
  }

  public newQuestion(): void {
    if (this.data.isFinished) {
      return;
    }

    this.resetCurrentLetterIndex();
    this.resetGuessedLetters();
    this.resetTries();
    this.generateWord();
    this.generateRandomLetters();

    if (this.currentQuestion === this.questionsCount) {
      this.data.isFinished = true;
      this.clearSavedData();
    }
    ++this.data.currentQuestion;
    this.updateHistoryState();
    this.saveToLocalStorage();
  }

  public restoreSavedData(): void {
    const data = localStorage.getItem(exerciseLocalStorageKey);
    if (data) {
      this.data = JSON.parse(data) as ExerciseData;
      // reset history to current state, to prevent navigation to state, before restore from LocalStorage
      // ToDo: We can also add history restoration in future
      this.updateHistoryState(true);
    }
  }

  public clearSavedData(): void {
    localStorage.removeItem(exerciseLocalStorageKey);
    this.isShowModal = false;
  }

  private setRestoreModalState(): void {
    this.isShowModal = this.currentQuestion === 1 && this.hasSavedData;
  }

  private saveToLocalStorage(): void {
    const hasData =
      this.data.currentQuestion > 1 || this.data.guessedLetters.length;
    if (!hasData || this.data.isFinished) {
      return;
    }
    localStorage.setItem(exerciseLocalStorageKey, JSON.stringify(this.data));
  }

  private generateWord(): void {
    const indexes = this.allWords.map((_, i) => i);
    const usedIndexes = Object.keys(this.data.usedWords).map((word) =>
      this.allWords.indexOf(word)
    );

    let randomIndex = Math.floor(Math.random() * indexes.length);
    while (usedIndexes.includes(randomIndex)) {
      randomIndex = Math.floor(Math.random() * indexes.length);
    }

    this.data.currentWord = this.allWords[`${indexes[randomIndex]}`];
    this.data.usedWords[this.allWords[`${indexes[randomIndex]}`]] = 0;
  }

  private generateRandomLetters(): void {
    if (!this.data.currentWord) {
      return;
    }
    const shuffledArray = [...this.data.currentWord];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    this.data.randomLetters = shuffledArray;
  }

  private resetCurrentLetterIndex(): void {
    this.data.currentLetterIndex = 0;
  }

  private resetTries(): void {
    this.data.tries = 0;
  }

  private resetGuessedLetters(): void {
    this.data.guessedLetters = [];
  }

  private logErrorToCurrentWord(): void {
    this.data.usedWords[this.data.currentWord] = ++this.data.usedWords[
      this.data.currentWord
    ];
  }

  private updateHistoryState(replace: boolean = false): void {
    replace
      ? history.replaceState(this.data, '')
      : history.pushState(this.data, '');
  }

  private restoreDataFromHistory = (event: PopStateEvent): void => {
    const data = event.state as ExerciseData;
    if (data) {
      this.data = data;
      this.onQuestionUpdate();
    }
  };

  private addHistoryListeners(): void {
    window.addEventListener('popstate', this.restoreDataFromHistory);
  }
}

export default ExerciseModule;
