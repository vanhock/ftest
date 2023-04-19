export interface LetterProps {
  class?: string;
  text: string | number;
  index: number;
  onClick?: Function;
}

class LetterComponent {
  private props: LetterProps;
  constructor(
    props: LetterProps = { class: 'btn-primary', text: '', index: 0 }
  ) {
    this.props = props;
  }

  public template() {
    return `<button type="button" class="btn ${this.props.class}" data-index="${this.props.index}" style="margin: 0 3px; width: 40px; height: 40px">
                ${this.props.text}
            </button>`;
  }

  protected addEventListeners(): void {
    console.log('add listener letter', this.props.text);
  }

  protected removeEventListeners?(): void {
    console.log('remover listener', this.props.text);
  }
}
export default LetterComponent;
