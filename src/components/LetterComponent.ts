export interface LetterProps {
  class?: string;
  tabIndex?: number;
  text: string | number;
  index: number;
  onClick?: Function;
}

class LetterComponent {
  private props: LetterProps;
  constructor(
    props: LetterProps = {
      class: 'btn-primary',
      text: '',
      index: 0,
      tabIndex: -1,
    }
  ) {
    this.props = props;
  }

  public template() {
    return `<button type="button" 
              class="btn ${this.props.class}" 
              data-index="${this.props.index}" 
              tabindex="${this.props.tabIndex}" 
              style="margin: 0 3px; width: 40px; height: 40px">
                ${this.props.text}
            </button>`;
  }
}
export default LetterComponent;
