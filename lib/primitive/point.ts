import { draw_circle } from "../draw.utils";
import { Vec2 } from "../types";

export class Point {
  x: number;
  y: number;
  vect2: Vec2;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vect2 = { x: this.x, y: this.y };
  }

  draw(
    ctx: CanvasRenderingContext2D,
    radius: number = 5,
    color: string = "red"
  ) {
    draw_circle(ctx, this.vect2, radius, color);
  }

  equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
