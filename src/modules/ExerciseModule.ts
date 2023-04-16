interface ExerciseData {
    tries: number,
    word: string[],
    currentLetterIndex: string,
    randomSymbols: string[],
    maxTries: number
}

export interface ExerciseProps {
    allWords: string[],
    usedWords: string[],
    params: {
        maxTries: number
    }
}

export interface ExerciseResult {
    tries: number,
    success: boolean,
    currentGuess: boolean
}

class ExerciseModule {
    private readonly props: ExerciseProps = {
        allWords: null,
        usedWords: null,
        params: {
            maxTries: 3
        }
    };
    private data: ExerciseData = {
        tries: 0,
        word: null,
        currentLetterIndex: -1,
        randomSymbols: null,
        maxTries: number
    };

    constructor(props: ExerciseProps) {
        this.props = props;
    }

    public init() {
        this.setParams();
        this.generateWord();
        this.generateRandomSymbols();
    }

    get randomSymbols(): string[] {
        return this.data.randomSymbols;
    }


    public checkResult(selectedIndex: number): ExerciseResult {
        const result:ExerciseResult = {
            tries: this.data.tries,
            success: false,
            currentGuess: false,
        }

        if (!result.tries) {
            return result;
        }

        result.currentGuess = this.data.word[this.data.currentLetterIndex] === this.data.word[selectedIndex];

        if (this.data.currentLetterIndex === this.data.word.length) {
            result.success = true;
        } else {
            ++this.data.currentLetterIndex;
        }

        if (!result.currentGuess) {
            --this.data.tries;
        }

        return result;
    }

    static generateWord(): void {
        const indexes = this.props.allWords.map((_, i) => i);
        const usedIndexes = this.props.usedWords.map((word) => word.indexOf(this.props.allWords));

        let randomIndex = Math.floor(Math.random() * indexes.length);
        while (usedIndexes.includes(randomNumber)) {
            randomIndex = Math.floor(Math.random() * indexes.length);
        }

        this.data.word = indexes[randomIndex].split('');
        this.data.currentLetterIndex = 0;
    }

    static generateRandomSymbols(): void {
        if (!this.data.word) {
            return;
        }
        const shuffledArray = [...this.props.word];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        this.data.randomSymbols = shuffledArray;
    }

    static setParams(): void {
        if (this.props.params) {
            Object.keys(this.props.params).forEach((key) => {
                this.data[key] = this.props.params[key];
            })
        }
    }
}

export default ExerciseModule;
