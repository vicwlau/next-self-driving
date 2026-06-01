import { neuron_counts } from "./const";
import { Controls } from "./controls";
import { NeuralNetwork } from "./network";
import { Sensor } from "./sensor";
import { polygons_intersect, Segment } from "./utils";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;

  speed: number;
  max_speed: number;
  acceleration: number;
  friction: number;

  angle: number;

  sensor: Sensor | null = null;

  polygon: { x: number; y: number }[] = [];
  damaged: boolean;

  brain: NeuralNetwork | null = null;
  controls: Controls | null = null;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    max_speed: number = 10,
    //
    control_type: "user" | "traffic" | "ai" = "user",
    controls: Controls | null = null,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 5;
    this.max_speed = max_speed;
    this.acceleration = 0.2;
    this.friction = 0.05;

    this.angle = 0;
    this.controls = controls;

    if (control_type === "user") {
      this.sensor = new Sensor(this);
    }
    if (control_type === "ai") {
      this.sensor = new Sensor(this);
      // this.brain = new NeuralNetwork([this.sensor.ray_count, 6, 100, 100, 4]);
      // 5 sensor rays, 6 neurons in first hidden layer, 4 output neurons (controls)

      this.brain = new NeuralNetwork([this.sensor.ray_count, neuron_counts, 4]);
    }

    this.damaged = false;
  }

  update(road_borders: Segment[][], traffic: Car[] = []) {
    // move if not damaged
    if (!this.damaged) {
      this.move(this.controls);
      this.polygon = this.create_polygon();
      this.damaged = this.assess_damage(road_borders, traffic);
    }

    if (this.sensor) {
      this.sensor.update(road_borders, traffic);

      const offsets = this.sensor.readings.map(
        (s) => (s == null ? 0 : 1 - s.offset), // increase value for closer objects
      );

      if (!this.brain) return;
      const outputs = NeuralNetwork.feed_forward(offsets, this.brain);
      // console.log(outputs);

      this.controls!.forward = outputs[0] == 1;
      this.controls!.left = outputs[1] == 1;
      this.controls!.right = outputs[2] == 1;
      this.controls!.backward = outputs[3] == 1;
    }
  }

  draw_car_and_sensor(
    ctx: CanvasRenderingContext2D,
    draw_sensor: boolean = false,
  ) {
    // determine car color
    if (this.damaged)
      ctx.fillStyle = "gray"; // damaged car
    else if (!this.sensor)
      ctx.fillStyle = "red"; // traffic
    else ctx.fillStyle = "blue"; // user car

    // draw polygon
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    // draw sensor
    if (this.sensor && draw_sensor) this.sensor.draw(ctx);
  }

  /**
   * This is the old draw method before polygon implementation
   * Use context rotation to draw the car at an angle
   * @deprecated
   */
  draw_legacy(ctx: CanvasRenderingContext2D) {
    ctx.save();
    // rotation
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore();
    if (this.sensor) this.sensor.draw(ctx);
  }

  /**
   * Creates a polygon representing the car's current position and orientation
   * @returns { x: number; y: number }[]
   */
  private create_polygon(): Segment[] {
    const points = [];
    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    // top right
    points.push({
      //   x: this.x - Math.sin(this.angle - alpha) * radius * 3, // test non-standard shape
      //   y: this.y - Math.cos(this.angle - alpha) * radius * 3,
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });

    // top left
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });

    // bottom left
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });

    // bottom right
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });

    return points;
  }

  private assess_damage(road_borders: Segment[][], traffic: Car[]) {
    for (let i = 0; i < road_borders.length; i++) {
      if (polygons_intersect(this.polygon, road_borders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polygons_intersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  private move(controls: Controls | null) {
    // traffic movement
    if (!controls) {
      this.y -= this.speed;
    } else {
      if (controls.forward) this.speed += this.acceleration;
      if (controls.backward) this.speed -= this.acceleration;

      // friction
      if (this.speed > 0) this.speed -= this.friction;
      if (this.speed < 0) this.speed += this.friction;
      if (Math.abs(this.speed) < this.friction) this.speed = 0;

      // left and right control
      if (this.speed != 0) {
        const flip = this.speed > 0 ? 1 : -1;
        if (controls.left) this.angle += 0.03 * flip;
        if (controls.right) this.angle -= 0.03 * flip;
      }
    }
    // speed limits
    if (this.speed > this.max_speed) this.speed = this.max_speed;
    if (this.speed < -this.max_speed / 2) this.speed = -this.max_speed / 2;

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
}
