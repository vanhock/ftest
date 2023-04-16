abstract class Renderer<T> {
  protected container: Element;
  protected props: T;

  protected constructor(container: Element, props: T) {
    this.container = container;
    this.props = props;
    this.render();
  }

  public abstract template(): string;

  public render(): void {
    this.container.innerHTML = this.template();
  }
}

export default Renderer;
