export interface MouseCoords {
  x: number;
  y: number;
}

export type MouseCallback = (coords: MouseCoords, event: MouseEvent) => void;

export interface MouseInputParams {
  is_remove_context_menu: boolean;
}

export class MouseInput {
  private base_element: HTMLCanvasElement;
  private abort_controller: AbortController | null = null;

  on_up?: MouseCallback;
  on_down?: MouseCallback;
  on_move?: MouseCallback;
  on_wheel?: (e: WheelEvent) => void;

  private is_remove_contextmenu = false;

  constructor(base_element: HTMLCanvasElement, options: MouseInputParams) {
    this.base_element = base_element;
    this.is_remove_contextmenu = options.is_remove_context_menu;
  }

  start(): void {
    // Clean up if already started
    if (this.abort_controller) this.dispose();

    this.abort_controller = new AbortController();
    const { signal } = this.abort_controller;

    if (this.is_remove_contextmenu) {
      this.base_element.addEventListener(
        "contextmenu",
        (e) => this.handle_context_menu(e),
        { signal }
      );
    }
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

  private handle_context_menu(e: MouseEvent): void {
    e.preventDefault();
  }

  private handle_mouseup(e: MouseEvent): void {
    this.on_up?.(this.get_coords(e), e);
  }

  private handle_mousedown(e: MouseEvent): void {
    this.on_down?.(this.get_coords(e), e);
  }

  private handle_mousemove(e: MouseEvent): void {
    this.on_move?.(this.get_coords(e), e);
  }

  private handle_mousewheel(e: WheelEvent): void {
    this.on_wheel?.(e);
  }
}
