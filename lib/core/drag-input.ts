export interface Point2D {
  x: number;
  y: number;
}

export interface DragOffset {
  dx: number;
  dy: number;
  distance: number;
}

export interface DragState {
  origin: Point2D;
  end: Point2D | null;
  offset: DragOffset;
}

export class DragInput {
  // main objects
  private base_element: HTMLCanvasElement;
  private abort_controller: AbortController | null = null;

  origin: Point2D | null = null;
  current: Point2D | null = null;
  last_drag_state: DragState | null = null;

  // callbacks
  onStart?: (origin: Point2D, evt: MouseEvent) => void;
  onMove?: (state: DragState, evt: MouseEvent) => void;
  onEnd?: (state: DragState, evt: MouseEvent) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.base_element = canvas;
  }

  start(): void {
    // Clean up if already started
    if (this.abort_controller) this.dispose();

    this.abort_controller = new AbortController();
    const { signal } = this.abort_controller;

    // critical
    this.add_event_listeners(signal);
  }

  dispose(): void {
    if (this.abort_controller) {
      this.abort_controller.abort();
      this.abort_controller = null;
    }
  }

  private start_drag(origin: Point2D, evt: MouseEvent) {
    this.origin = origin;
    this.current = origin;

    if (this.onStart) {
      this.onStart({ ...origin }, evt);
    }
  }

  private move_drag(current: Point2D, evt: MouseEvent) {
    if (!this.origin) return;

    const dx = current.x - this.origin.x;
    const dy = current.y - this.origin.y;

    const distance = this.get_distance(this.origin, current);
    const offset = {
      dx,
      dy,
      distance,
    };

    const state: DragState = {
      origin: this.origin,
      end: null,
      offset,
    };

    if (this.onMove) this.onMove(state, evt);
  }

  private end_drag(end: Point2D, evt: MouseEvent) {
    if (!this.origin) return;

    const dx = end.x - this.origin.x;
    const dy = end.y - this.origin.y;

    const distance = this.get_distance(this.origin, end);
    const offset = {
      dx,
      dy,
      distance,
    };

    const state: DragState = {
      origin: this.origin,
      end: null,
      offset,
    };

    if (this.onEnd) this.onEnd(state, evt);

    this.origin = null;
    this.current = null;
  }

  private get_distance(p1: Point2D, p2: Point2D) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  is_dragging() {
    return this.current !== null;
  }

  private add_event_listeners(signal: AbortSignal) {
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
  }

  private get_coords(e: MouseEvent) {
    return { x: e.offsetX, y: e.offsetY };
  }
  private handle_mouseup(e: MouseEvent): void {
    this.end_drag(this.get_coords(e), e);
  }

  private handle_mousedown(e: MouseEvent): void {
    this.start_drag(this.get_coords(e), e);
  }

  private handle_mousemove(e: MouseEvent): void {
    this.move_drag(this.get_coords(e), e);
  }
}
