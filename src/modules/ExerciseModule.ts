interface ExerciseProps {
  onQuestionUpdate: Function
}

interface ExerciseData {
  usedWords: {
    [key: string]: number;
  };
  tries: number;
  currentQuestion: number;
  currentWord: string;
  randomLetters: string[];
  currentLetterIndex: number;
  guessedLetters: string[];
  finished: boolean
}

interface ExerciseSettings {
  questions: number,
  maxTries: number,
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
    finished: false
  };
  private setting: ExerciseSettings = {
    questions: 6,
    maxTries: 3,
  };
  private readonly onQuestionUpdate: Function;

  constructor(props: ExerciseProps) {
    this.onQuestionUpdate = props.onQuestionUpdate;
    this.newQuestion();
  }

  get isFinished(): boolean {
    return this.data.finished;
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

  get errorsCount(): number {
      return Object.values(this.data.usedWords).reduce((acc, value: number) => acc + value, 0);
  }

  get wordWithMaxErrors(): string {
      const values = Object.values(this.data.usedWords);
      const maxErrors = Math.max(...values);
      if (maxErrors === 0) {
        return '-'
      }

      return Object.keys(this.data.usedWords)[values.indexOf(maxErrors)];
  }

  get wordsWithNoErrorsCount(): number {
      return Object.values(this.data.usedWords).reduce((acc, value) => {
        if (!value) ++acc;
        return acc;
      }, 0)
  }

  public guessLetter(letter: string): boolean {
    const currentGuess =
      this.data.currentWord[this.data.currentLetterIndex] === letter;

    if (currentGuess) {
      ++this.data.currentLetterIndex;
      this.data.guessedLetters.push(letter);
      // If all letters guessed
      if (this.data.currentLetterIndex === this.data.currentWord.length) {
        this.newQuestion();
        this.onQuestionUpdate();
      }
    } else {
      ++this.data.tries;
      this.logErrorToCurrentWord();
    }

    if (this.data.tries === this.setting.maxTries) {
      this.newQuestion();
      this.onQuestionUpdate();
    }

    return currentGuess;
  }

  public newQuestion(): void {
    if (this.data.finished) {
      return;
    }

    this.resetCurrentLetterIndex();
    this.resetGuessedLetters();
    this.resetTries();
    this.generateWord();
    this.generateRandomLetters();

    if (this.currentQuestion === this.questionsCount) {
      this.data.finished = true;
    }
    ++this.data.currentQuestion;
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
    this.data.usedWords[this.data.currentWord] = ++this.data.usedWords[this.data.currentWord];
  }
}

export default ExerciseModule;
