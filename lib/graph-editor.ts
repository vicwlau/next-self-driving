import { Graph } from "./math/graph";
import { MouseInput } from "./mouse-input";
import { Point } from "./primitive/point";

export class GraphEditor implements BaseObject {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  graph: Graph;
  animation_id: number = 0;

  mouse_input: MouseInput;

  constructor(canvas: HTMLCanvasElement, graph: Graph) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context");
    }
    this.ctx = context;
    this.graph = graph;
    this.mouse_input = new MouseInput(canvas);
  }

  start(): void {
    if (this.animation_id !== 0) return; // Already started

    // assign delegates before start
    this.mouse_input.delegate_mouseup = (coords) => {
      this.handle_mouseup(new Point(coords.x, coords.y));
    };

    this.mouse_input.start();
    this.loop();
  }

  dispose(): void {
    cancelAnimationFrame(this.animation_id);
    this.animation_id = 0;
    this.mouse_input.dispose();
  }
  loop = () => {
    this.update();
    this.animation_id = requestAnimationFrame(this.loop);
  };

  update(): void {
    this.clear();
    this.graph.draw(this.ctx);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  handle_mouseup(point: Point): void {
    this.graph.try_add_point(point);
  }
}
