import { draw_circle, DrawCircleParams } from "../draw.utils";
import { Vec2 } from "../types";

export class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    options: Omit<DrawCircleParams, "center">
  ) {
    //
    draw_circle(ctx, {
      center: this,
      ...options,
    });
  }

  equals(other: Point | null): boolean {
    if (!other) return false;
    return this.x === other.x && this.y === other.y;
  }
}
