export interface MouseCoords {
  x: number;
  y: number;
}

export type MouseCallback = (coords: MouseCoords, event: MouseEvent) => void;

export class MouseInput {
  private base_element: HTMLCanvasElement;
  private abort_controller: AbortController | null = null;

  delegate_mouseup?: MouseCallback;
  delegate_mousedown?: MouseCallback;
  delegate_mousemove?: MouseCallback;
  delegate_mousewheel?: (e: WheelEvent) => void;

  constructor(base_element: HTMLCanvasElement) {
    this.base_element = base_element;
  }

  start(): void {
    // Clean up if already started
    if (this.abort_controller) this.dispose();

    this.abort_controller = new AbortController();
    const { signal } = this.abort_controller;

    this.base_element.addEventListener(
      "mouseup",
      (e) => this.handle_mouseup(e),
      { signal }
    );
    this.base_element.addEventListener(
      "mousedown",
      (e) => this.handle_mousedown(e),
      { signal }
    );
    this.base_element.addEventListener(
      "mousemove",
      (e) => this.handle_mousemove(e),
      { signal }
    );
    this.base_element.addEventListener(
      "wheel",
      (e) => this.handle_mousewheel(e),
      { signal }
    );
  }

  dispose(): void {
    if (this.abort_controller) {
      this.abort_controller.abort();
      this.abort_controller = null;
    }
  }

  private get_coords(e: MouseEvent): MouseCoords {
    return { x: e.offsetX, y: e.offsetY };
  }

  private handle_mouseup(e: MouseEvent): void {
    this.delegate_mouseup?.(this.get_coords(e), e);
  }

  private handle_mousedown(e: MouseEvent): void {
    this.delegate_mousedown?.(this.get_coords(e), e);
  }

  private handle_mousemove(e: MouseEvent): void {
    this.delegate_mousemove?.(this.get_coords(e), e);
  }

  private handle_mousewheel(e: WheelEvent): void {
    this.delegate_mousewheel?.(e);
  }
}
