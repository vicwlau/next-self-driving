import { Graph } from "./math/graph";
import { Point } from "./primitive/point";
import { Segment } from "./primitive/segment";

export class WorldEditor {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  graph: Graph;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    if (!this.ctx) throw new Error("Could not get 2D context");

    canvas.width = 600;
    canvas.height = 600;

    const p1 = new Point(200, 200);
    const p2 = new Point(500, 200);
    const p3 = new Point(400, 400);
    const p4 = new Point(100, 300);

    const s1 = new Segment(p1, p2);
    const s2 = new Segment(p2, p3);
    const s3 = new Segment(p3, p4);

    this.graph = new Graph([p1, p2, p3, p4], [s1, s2, s3]);
    this.graph.draw(this.ctx);
  }
}
