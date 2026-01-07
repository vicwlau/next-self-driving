import { draw_segment } from "../draw.utils";
import { Point } from "./point";

export class Segment {
  p1: Point;
  p2: Point;

  constructor(p1: Point | null, p2: Point | null) {
    if (!p1 || !p2) throw new Error("null points");
    if (p1.equals(p2)) {
      throw new Error("A segment cannot have identical endpoints.");
    }
    this.p1 = p1;
    this.p2 = p2;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    width: number = 2,
    color: string = "blue"
  ) {
    draw_segment(ctx, this, width, color);
  }

  equals(other: Segment): boolean {
    return this.includes(other.p1) && this.includes(other.p2);
  }

  includes(point: Point): boolean {
    return this.p1.equals(point) || this.p2.equals(point);
  }
}
