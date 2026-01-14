import { angle, subtract, translate } from "../math/utils";
import { Point } from "./point";
import { Polygon } from "./polygon";

export class Envelope {
  private skeleton: { p1: Point; p2: Point };

  polygon: Polygon;

  constructor(
    skeleton: { p1: Point; p2: Point },
    width: number,
    roundness: number = 1
  ) {
    this.skeleton = skeleton;
    this.polygon = this.generate_polygon(width, roundness);
  }

  private generate_polygon(width: number, roundness: number) {
    const { p1, p2 } = this.skeleton;

    const radius = width / 2;
    const alpha = angle(subtract(p2, p1)); // angle of the segment, vector of p1 to p2
    const alpha_clock_wise = alpha + Math.PI / 2; // perpendicular angle, 90 degrees clockwise from direction of p1 facing p2. Math.PI/2 = 90 degrees or 1.57 rad (360 degrees is 6.28 rad)
    const alpha_counter_clock_wise = alpha - Math.PI / 2; // perpendicular angle, 90 degrees counter-clockwise from direction of p1 facing p2

    const points = [];
    // roundness
    const step = Math.max(Math.PI / roundness, 1); // 18 degrees, controls the curvature smoothness
    const epsilon = step / 2;

    // cw > ccw because of html5 canvas y-down coordinate system. Positive angles rotate clockwise. counter-clockwise is negative angles.

    for (
      let i = alpha_counter_clock_wise;
      i <= alpha_clock_wise + epsilon;
      i += step
    ) {
      points.push(translate(p1, i + Math.PI, radius)); // arc behind p1
    }

    for (
      let i = alpha_counter_clock_wise;
      i <= alpha_clock_wise + epsilon;
      i += step
    ) {
      points.push(translate(p2, i, radius)); // arc in front of p2
    }

    return new Polygon(points);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.polygon.draw(ctx);
  }
}
