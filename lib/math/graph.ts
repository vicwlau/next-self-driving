import { Point } from "../primitive/point";
import { Segment } from "../primitive/segment";

export class Graph {
  points: Point[] = [];
  segments: Segment[] = [];

  constructor(points: Point[], segments: Segment[] = []) {
    this.points = points;
    this.segments = segments;
  }

  add_point(point: Point) {
    this.points.push(point);
  }

  add_segment(segment: Segment) {
    this.segments.push(segment);
  }

  contains_point(point: Point): boolean {
    return this.points.some((p) => p.equals(point));
  }

  contains_segment(segment: Segment): boolean {
    return this.segments.some((s) => s.equals(segment));
  }

  try_add_point(point: Point): boolean {
    if (!this.contains_point(point)) {
      this.add_point(point);
      return true;
    }
    return false;
  }

  try_add_segment(segment: Segment): boolean {
    const exists = this.contains_segment(segment);
    if (!exists) {
      this.add_segment(segment);
      return true;
    }
    return false;
  }

  remove_segment(segment: Segment) {
    const index = this.segments.findIndex((s) => s.equals(segment));
    if (index !== -1) {
      this.segments.splice(index, 1);
    }
  }

  remove_point(point: Point) {
    const index = this.points.findIndex((p) => p.equals(point));
    if (index !== -1) {
      this.points.splice(index, 1);
    }
    // Also remove any segments connected to this point
    this.segments = this.segments.filter((s) => !s.includes(point));
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const segment of this.segments) {
      segment.draw(ctx);
    }

    for (const point of this.points) {
      point.draw(ctx);
    }
  }

  dispose() {
    this.points.length = 0;
    this.segments.length = 0;
  }
}
