import { Car } from "./car";
import {
  number_of_ai_cars,
  number_of_traffic_cars,
  car_width,
  car_height,
  traffic_max_speed,
} from "./const";
import { Controls } from "./controls";
import { NeuralNetwork } from "./network";
import { Road } from "./road";

export class DrivingGame {
  // canvas and context
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  // input
  player_controls: Controls;

  // game objects
  road: Road;
  cars: Car[];
  traffic: Car[] = [];

  best_car: Car;

  // animation
  animation_id: number;

  storage_key = "best_brain";

  constructor(
    canvas: HTMLCanvasElement,
    config: {
      learningRate: number;
      trafficDensity: number;
      doubleLane: boolean;
    }
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    this.ctx = ctx;
    this.canvas.width = 200;
    this.canvas.height = window.innerHeight;

    this.player_controls = new Controls();

    this.road = new Road(this.canvas.width / 2, this.canvas.width * 0.9);

    // ai cars
    this.cars = this.generate_ai_cars(number_of_ai_cars);

    // traffic cars
    Array.from({ length: number_of_traffic_cars }).forEach((_, i) => {
      const lane = Math.floor(Math.random() * 4);
      const y = -200 - i * config.trafficDensity;
      this.traffic.push(
        new Car(
          this.road.get_lane_center(lane),
          y,
          car_width,
          car_height,
          traffic_max_speed,
          "traffic"
        )
      );
      // add another car in same lane
      if (i % 5 === 0 && config.doubleLane) {
        this.traffic.push(
          new Car(
            this.road.get_lane_center(lane + 1),
            y,
            car_width,
            car_height,
            traffic_max_speed,
            "traffic"
          )
        );
      }
    });

    this.best_car = this.cars[0];

    const load = localStorage.getItem(this.storage_key);
    if (load) {
      const parsed_brain = JSON.parse(load);
      this.cars[0].brain = parsed_brain;
      this.cars.forEach((car, i) => {
        car.brain = JSON.parse(load);
        if (i != 0) {
          // mutate other cars
          if (!car.brain) return;
          NeuralNetwork.mutate(car.brain, config.learningRate);
        }
      });
    }

    this.animation_id = 0;
  }

  private generate_ai_cars(count: number) {
    let cars: Car[] = [];
    const start_y = 30;
    const lane = this.road.get_lane_center(1);

    for (let i = 0; i < count; i++) {
      cars.push(
        new Car(lane, start_y, car_width, car_height, 5, "ai", new Controls())
      );
    }
    return cars;
  }

  discard() {
    localStorage.removeItem(this.storage_key);
  }

  save() {
    localStorage.setItem(this.storage_key, JSON.stringify(this.best_car.brain));
  }

  start() {
    this.player_controls.add_listeners();
    this.animation_id = requestAnimationFrame(this.loop);
  }
  dispose() {
    this.player_controls.remove_listeners();
    cancelAnimationFrame(this.animation_id);
  }

  private update() {
    // update car position based on controls and road borders
    this.cars.forEach((c) => c.update(this.road.borders, this.traffic));
    this.traffic.forEach((car) => car.update(this.road.borders, []));

    // clear screen OR this.ctx.clearRec()
    this.canvas.height = window.innerHeight;

    this.best_car = this.cars.reduce((prev, curr) =>
      prev.y < curr.y ? prev : curr
    );

    // camera translation
    this.ctx.save();
    this.ctx.translate(0, -this.best_car.y + this.canvas.height * 0.7); // center car vertically, with offset by moving canvas down

    // draw road, car and traffic
    this.ctx.globalAlpha = 0.2;

    this.road.draw(this.ctx);
    this.cars.forEach((c) => {
      const show_sensor = c === this.best_car;
      if (show_sensor) this.ctx.globalAlpha = 1;
      else this.ctx.globalAlpha = 0.2;
      c.draw_car_and_sensor(this.ctx, show_sensor);
    });
    this.traffic.forEach((car) => {
      car.draw_car_and_sensor(this.ctx);
    });

    this.ctx.globalAlpha = 1;
    this.ctx.restore();
  }

  private loop = () => {
    this.update();
    this.animation_id = requestAnimationFrame(this.loop);
  };
}
