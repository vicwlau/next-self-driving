export interface Segment {
  x: number;
  y: number;
}

export interface Intersection {
  x: number;
  y: number;
  offset: number; // between 0 and 1; how far along the segment the intersection is
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function get_intersections(
  A: Segment,
  B: Segment,
  C: Segment,
  D: Segment
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

/**
 * Checks if two polygons intersect
 * Modulo operation is used to loop back to the first point after reaching the last point
 *
 * @param poly1 First polygon as an array of segments (points)
 * @param poly2 Second polygon as an array of segments (points)
 * @returns true if the polygons intersect, false otherwise
 */
export function polygons_intersect(poly1: Segment[], poly2: Segment[]) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = get_intersections(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}
