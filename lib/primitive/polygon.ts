import { get_intersections } from "../math/utils";
import { Point } from "./point";
import { Segment } from "./segment";

export class Polygon {
  private segments: Segment[] = [];
  constructor(public points: Point[]) {
    // generate segments
    for (let i = 1; i <= points.length; i++) {
      this.segments.push(
        new Segment(
          points[i - 1],
          points[i % points.length] // wrap around to the first point
        )
      );
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    { stroke = "blue", line_width = 2, fill = "rgba(0,0,255,0.3)" } = {}
  ) {
    if (this.points.length === 0) return;

    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = line_width;
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  static break(poly1: Polygon, poly2: Polygon): Point[] {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
    const intersections: Point[] = [];
    for (let i = 0; i < segs1.length; i++) {
      for (let j = 0; j < segs2.length; j++) {
        const inter = get_intersections(
          segs1[i].p1,
          segs1[i].p2,
          segs2[j].p1,
          segs2[j].p2
        );

        if (inter && inter.offset != 1 && inter.offset != 0) {
          // exclude edge intersections
          const point = new Point(inter.x, inter.y);
          intersections.push(point);
        }
      }
    }
    return intersections;
  }
}
