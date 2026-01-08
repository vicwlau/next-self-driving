import { draw_segment, DrawSegmentParams } from "../draw.utils";
import { Point } from "./point";

export class Segment {
  p1: Point;
  p2: Point;

  constructor(p1: Point, p2: Point) {
    if (p1.equals(p2)) {
      const msg = "A segment cannot have identical endpoints";
      console.warn(msg);
      // throw new Error(msg);
    }
    this.p1 = p1;
    this.p2 = p2;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    options: Omit<DrawSegmentParams, "segment">
  ) {
    draw_segment(ctx, { segment: this, ...options });
  }

  equals(other: Segment): boolean {
    return this.includes(other.p1) && this.includes(other.p2);
  }

  includes(point: Point): boolean {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  get is_valid(): boolean {
    return !this.p1.equals(this.p2);
  }
}
