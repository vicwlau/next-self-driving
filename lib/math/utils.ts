import { Point } from "../primitive/point";

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
