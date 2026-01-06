import { Segment } from "./primitive/segment";
import { Line, Vec2 } from "./types";

export function draw_segment(
  ctx: CanvasRenderingContext2D,
  segment: Segment,
  width: number = 2,
  color: string = "black"
) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.moveTo(segment.p1.x, segment.p1.y);
  ctx.lineTo(segment.p2.x, segment.p2.y);
  ctx.stroke();
}

export function draw_circle(
  ctx: CanvasRenderingContext2D,
  center: Vec2,
  radius: number,
  color: string = "black"
) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fill();
}
