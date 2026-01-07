import { Point } from "./primitive/point";

export class ViewPort implements BaseObject {
  canvas: HTMLCanvasElement;

  zoom: number = 1;
  offset = new Point(0, 0);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  start(): void {}

  dispose(): void {}

  get_world_point(e: MouseEvent) {
    return new Point(
      e.offsetX * this.zoom - this.offset.x,
      e.offsetY * this.zoom - this.offset.y
    );
  }

  handle_mousewheel(e: WheelEvent) {
    const dir = Math.sign(e.deltaY);
    const step = 0.1;
    this.zoom += dir * step;
    this.zoom = Math.max(1, Math.min(5, this.zoom)); // between 1 and 5
  }
}
