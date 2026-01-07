import { Segment } from "./primitive/segment";
import { Vec2 } from "./types";

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

export interface DrawCircleParams {
  center: Vec2;
  radius?: number;
  color?: string;
  line_width?: number;
  filled?: boolean;
  dashed?: boolean;
}

export function draw_circle(
  ctx: CanvasRenderingContext2D,
  params: DrawCircleParams
) {
  const {
    center,
    radius = 5,
    color = "black",
    line_width = 2,
    filled = true,
    dashed = false,
  } = params;

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = line_width;
  if (dashed) ctx.setLineDash([3, 3]);

  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);

  if (filled) ctx.fill();
  else ctx.stroke();
  ctx.setLineDash([]);
}
