import { Point } from "../primitive/point";
import { Segment } from "../primitive/segment";

export function get_nearest_point(
  target: Point,
  points: Point[],
  max_dist: number = 10
): Point | null {
  //
  let nearest_dist = max_dist;
  let nearest_point: Point | null = null;

  for (const p of points) {
    const dist = distance(target, p);
    if (dist < nearest_dist) {
      nearest_dist = dist;
      nearest_point = p;
    }
  }

  return nearest_point;
}

export function distance(p1: Point, p2: Point) {
  // a^2 + b^2 = c^2
  const dx = p2.x - p1.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function distance_sqr(p1: Point, p2: Point) {
  const dx = p2.x - p1.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

export function add(p1: Point, p2: Point): Point {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

export function subtract(p1: Point, p2: Point): Point {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

export function scale(p: Point, scaler: number): Point {
  return new Point(p.x * scaler, p.y * scaler);
}

/**
 * Translates a point by a given angle and distance.
 *
 * Note: In a Y-down coordinate system (HTML5 Canvas), positive angles rotate
 * clockwise from the positive x-axis (3 o'clock).
 *
 * @param p - The starting point.
 * @param angle_rad - Angle in radians (1 rad ≈ 57.3°, 2π rad = 360°).
 * @param distance - Distance to move from the starting point.
 * @returns A new Point at the translated position.
 * @example
 * translate(new Point(0, 0), Math.PI / 2, 10); // Returns Point(0, 10) - 6 o'clock
 */
export function translate(
  p: Point,
  angle_rad: number,
  distance: number
): Point {
  return new Point(
    p.x + distance * Math.cos(angle_rad),
    p.y + distance * Math.sin(angle_rad)
  );
}

export function angle(p: Point): number {
  // todo why does this work?
  return Math.atan2(p.y, p.x);
}

export interface Intersection {
  x: number;
  y: number;
  offset: number; // between 0 and 1; how far along the segment the intersection is
}

export function get_intersections(
  A: Point,
  B: Point,
  C: Point,
  D: Point
): Intersection | null {
  const t_top = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const u_top = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
  if (bottom != 0) {
    const t = t_top / bottom;
    const u = u_top / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: A.x + t * (B.x - A.x),
        y: A.y + t * (B.y - A.y),
        offset: t,
      };
    }
  }
  return null;
}
