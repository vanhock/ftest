export interface LetterProps {
  class?: string;
  text: string | number;
  onClick?: Function;
}

class LetterComponent {
  private props: LetterProps;
  constructor(props: LetterProps = { class: 'btn-primary', text: '' }) {
    this.props = props;
  }

  public template() {
    return `<button type="button" class="btn ${this.props.class}" data-id="${this.props.text}">
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
