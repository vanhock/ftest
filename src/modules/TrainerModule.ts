export interface TrainerWords {
  [key: string]: any;
}

class TrainerModule {
  private readonly words: TrainerWords;

  constructor(data: TrainerWords) {
    this.words = data;
  }

  getAll(): TrainerWords {
    return this.words;
  }
}

export default TrainerModule;
