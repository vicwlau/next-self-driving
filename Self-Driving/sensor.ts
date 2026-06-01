import { Car } from "./car";
import { get_intersections, Intersection, lerp, Segment } from "./utils";

export class Sensor {
  car: Car;
  ray_count: number;
  ray_length: number;
  ray_spread: number;

  rays: Segment[][];
  readings: (Intersection | null)[];

  constructor(car: Car) {
    this.car = car;
    this.ray_count = 5;
    this.ray_length = 150;
    this.ray_spread = Math.PI / 4; // 45 degrees

    this.rays = [];
    this.readings = [];
  }

  update(road_borders: Segment[][], traffic: Car[] = []) {
    this.cast_rays();
    this.readings = [];

    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(
        this.get_readings(this.rays[i], road_borders, traffic)
      );
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.ray_count; i++) {
      let end = this.rays[i][1]; // [1] is the end point of the ray
      const reading = this.readings[i];
      if (reading) {
        const x = reading.x;
        const y = reading.y;
        end = { x, y };
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }

  private get_readings(
    ray: Segment[],
    road_borders: Segment[][],
    traffic: Car[] = []
  ): Intersection | null {
    //
    let touches: Intersection[] = [];

    for (let i = 0; i < road_borders.length; i++) {
      const touch = get_intersections(
        // compare ray with each border
        ray[0],
        ray[1],
        // [0] is start point, [1] is end point of the border
        road_borders[i][0],
        road_borders[i][1]
      );

      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const touch = get_intersections(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length] // wrap around to first point
        );
        if (touch) {
          touches.push(touch);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const min_offset = Math.min(...offsets);
      return touches.find((e) => e.offset == min_offset) || null;
    }
  }

  private cast_rays() {
    this.rays = [];
    for (let i = 0; i < this.ray_count; i++) {
      const ray_angle =
        lerp(
          this.ray_spread / 2,
          -this.ray_spread / 2,
          this.ray_count == 1 ? 0.5 : i / (this.ray_count - 1)
        ) + this.car.angle;

      const start: Segment = { x: this.car.x, y: this.car.y };
      // cosine and sine are swapped because of canvas y axis direction
      const end: Segment = {
        x: this.car.x - Math.sin(ray_angle) * this.ray_length,
        y: this.car.y - Math.cos(ray_angle) * this.ray_length,
      };
      this.rays.push([start, end]);
    }
  }
}
