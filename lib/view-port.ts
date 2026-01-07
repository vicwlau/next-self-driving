import { Point } from "./primitive/point";

export class ViewPort implements BaseObject {
  canvas: HTMLCanvasElement;
  abort_controller: AbortController | null = null;

  zoom: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  start(): void {
    if (this.abort_controller) this.dispose();
    this.abort_controller = new AbortController();
    const { signal } = this.abort_controller;

    this.canvas.addEventListener("wheel", (e) => this.handle_mousewheel(e), {
      signal,
    });
  }

  dispose(): void {
    if (this.abort_controller) {
      this.abort_controller.abort();
      this.abort_controller = null;
    }
  }

  get_world_point(e: MouseEvent) {
    return new Point(e.offsetX * this.zoom, e.offsetY * this.zoom);
  }

  private handle_mousewheel(e: WheelEvent) {
    const dir = Math.sign(e.deltaY);
    const step = 0.1;
    this.zoom += dir * step;
    this.zoom = Math.max(1, Math.min(5, this.zoom)); // between 1 and 5
  }
}
