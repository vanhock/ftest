abstract class Renderer<T> {
  protected container: Element;
  protected props?: T;

  protected constructor(container: Element, props?: T) {
    this.container = container;
    if (props) this.props = props;
  }

  public render(): void {
    this.container.innerHTML = this.template();
    if (this.removeEventListeners) {
      this.removeEventListeners();
    }
    if (this.addEventListeners) {
      this.addEventListeners();
    }
  }

  public abstract template(): string;
  protected abstract addEventListeners?(): void;
  protected abstract removeEventListeners?(): void;
}

export default Renderer;
