import { Point } from "./point";
import { Segment } from "./segment";

export class Square {
  p1: Point;
  p2: Point;
  p3: Point;
  p4: Point;

  s1: Segment;
  s2: Segment;
  s3: Segment;
  s4: Segment;

  constructor(p1: Point, p2: Point, p3: Point, p4: Point) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;

    this.s1 = new Segment(p1, p2);
    this.s2 = new Segment(p2, p3);
    this.s3 = new Segment(p3, p4);
    this.s4 = new Segment(p4, p1);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.s1.draw(ctx, { color: "black", line_width: 2 });
    this.s2.draw(ctx, { color: "black", line_width: 2 });
    this.s3.draw(ctx, { color: "black", line_width: 2 });
    this.s4.draw(ctx, { color: "black", line_width: 2 });
  }
}
