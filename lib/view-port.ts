import { DragOffset } from "./core/drag-input";
import { Point } from "./primitive/point";

export class ViewPort implements BaseObject {
  canvas: HTMLCanvasElement;

  private _zoom: number = 1;
  private _offset = new Point(0, 0);
  private drag_start_offset: Point = new Point(0, 0);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  start(): void {}
  dispose(): void {}

  get_world_point(e: MouseEvent) {
    return new Point(
      e.offsetX * this._zoom - this._offset.x,
      e.offsetY * this._zoom - this._offset.y
    );
  }

  handle_mousewheel(e: WheelEvent) {
    const dir = Math.sign(e.deltaY);
    const step = 0.1;
    this._zoom += dir * step;
    this._zoom = Math.max(1, Math.min(5, this._zoom)); // between 1 and 5
  }

  handle_pan_start() {
    this.drag_start_offset = new Point(this._offset.x, this._offset.y);
  }

  handle_pan_move(offset: DragOffset) {
    this._offset.x = this.drag_start_offset.x + offset.dx * this._zoom;
    this._offset.y = this.drag_start_offset.y + offset.dy * this._zoom;
  }

  get offset(): { x: number; y: number } {
    return this._offset;
  }

  get zoom(): number {
    return this._zoom;
  }
}
