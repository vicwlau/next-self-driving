export interface MouseCoords {
  x: number;
  y: number;
}

export interface DragRecord {
  start_pos: MouseCoords;
  end_pos: MouseCoords;
  drag_distance: number;
}

export class Drag {
  // main objects
  private base_element: HTMLCanvasElement;
  private abort_controller: AbortController | null = null;

  // history
  last_drag_data: DragRecord | null = null;

  // current states
  private current_pos: MouseCoords | null = null;
  private start_pos: MouseCoords | null = null;
  private drag_distance: number | null = null;

  // callbacks
  callback_on_drag_start?: (start: MouseCoords) => void;
  callback_on_drag_update?: (current_pos: MouseCoords) => void;
  callback_on_drag_end?: (drag: DragRecord) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.base_element = canvas;
  }

  start(): void {
    // Clean up if already started
    if (this.abort_controller) this.dispose();

    this.abort_controller = new AbortController();
    const { signal } = this.abort_controller;

    this.add_event_listeners(signal);
  }

  dispose(): void {
    if (this.abort_controller) {
      this.abort_controller.abort();
      this.abort_controller = null;
    }
  }

  private start_drag(start_pos: MouseCoords) {
    this.start_pos = start_pos;
    this.current_pos = start_pos;
    this.drag_distance = 0;

    if (this.callback_on_drag_start) {
      this.callback_on_drag_start({ ...start_pos });
    }
  }

  private update_drag(current_pos: MouseCoords) {
    if (!this.start_pos) return;

    this.current_pos = current_pos;
    this.drag_distance = this.get_distance(this.start_pos, current_pos);

    if (this.callback_on_drag_update)
      this.callback_on_drag_update({ ...current_pos });
  }

  private end_drag(end_pos: MouseCoords) {
    if (!this.start_pos) return;

    const distance = this.get_distance(this.start_pos, end_pos);

    this.last_drag_data = {
      start_pos: { ...this.start_pos },
      end_pos: { ...end_pos },
      drag_distance: distance,
    };

    if (this.callback_on_drag_end)
      // deep copy
      this.callback_on_drag_end({
        start_pos: { ...this.last_drag_data.start_pos },
        end_pos: { ...this.last_drag_data.end_pos },
        drag_distance: distance,
      });

    this.start_pos = null;
    this.current_pos = null;
  }

  private get_distance(p1: MouseCoords, p2: MouseCoords) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  is_dragging() {
    return this.current_pos !== null;
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
    this.end_drag(this.get_coords(e));
  }

  private handle_mousedown(e: MouseEvent): void {
    if (e.button === 0)
      // restrict to left click only
      this.start_drag(this.get_coords(e));
  }

  private handle_mousemove(e: MouseEvent): void {
    // check buttons pressed `button*s*`; this returns value
    if (this.start_pos && e.buttons === 0) {
      this.end_drag(this.get_coords(e));
      return;
    }

    this.update_drag(this.get_coords(e));
  }
}
