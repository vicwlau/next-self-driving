import { error } from "console";
import { DragOffset } from "./core/drag-input";
import { scale } from "./math/utils";
import { Point } from "./primitive/point";

export class ViewPort implements BaseObject {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  private _zoom: number = 1;
  private _center = new Point(0, 0);
  private _offset = new Point(0, 0);
  private _drag_start_offset: Point = new Point(0, 0);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw Error("Failed to get 2d context");
    }
    this.ctx = context;
    this._center = new Point(canvas.width / 2, canvas.height / 2); // zoom from center
    this._offset = scale(this.center, -1); // center view to center
  }

  start(): void {}
  dispose(): void {}

  update(): void {
    // todo: fix issue with drag drop of intent segment 25min mark of part 3
    const ctx = this.ctx;
    ctx.restore();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.translate(this._center.x, this._center.y);
    ctx.scale(1 / this._zoom, 1 / this._zoom);
    ctx.translate(this._offset.x, this._offset.y);
  }

  get_world_point(e: MouseEvent) {
    return new Point(
      (e.offsetX - this.center.x) * this._zoom - this._offset.x,
      (e.offsetY - this.center.y) * this._zoom - this._offset.y
    );
  }

  handle_mousewheel(e: WheelEvent) {
    const dir = Math.sign(e.deltaY);
    const step = 0.1;
    this._zoom += dir * step;
    this._zoom = Math.max(1, Math.min(5, this._zoom)); // between 1 and 5
  }

  handle_pan_start() {
    this._drag_start_offset = new Point(this._offset.x, this._offset.y);
  }

  handle_pan_move(offset: DragOffset) {
    this._offset.x = this._drag_start_offset.x + offset.dx * this._zoom;
    this._offset.y = this._drag_start_offset.y + offset.dy * this._zoom;
  }

  get offset(): { x: number; y: number } {
    return this._offset;
  }

  get zoom(): number {
    return this._zoom;
  }

  get center() {
    return this._center;
  }
}
