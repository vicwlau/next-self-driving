import { DrivingGame } from "./driving-game";
import { Level, NeuralNetwork } from "./network";

interface Point {
  x: number;
  y: number;
}

export class VisualNetwork {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  driving_game: DrivingGame;
  animation_id: number;

  dash_offset: number = 0;

  constructor(canvas: HTMLCanvasElement, driving_game: DrivingGame) {
    this.canvas = canvas;
    this.driving_game = driving_game;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    this.ctx = ctx;
    this.canvas.width = 600;
    this.canvas.height = window.innerHeight;

    this.animation_id = 0;
  }

  start() {
    this.animation_id = requestAnimationFrame(this.loop);
  }
  dispose() {
    cancelAnimationFrame(this.animation_id);
  }

  private loop = () => {
    this.update();
    this.animation_id = requestAnimationFrame(this.loop);
  };

  private update() {
    this.dash_offset += 0.5;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw_network(this.driving_game.best_car?.brain);
  }

  draw_network(network: NeuralNetwork | null) {
    if (!network) return;

    const margin = 60;
    const top = margin;
    const left = margin;
    const width = this.canvas.width - margin * 2;
    const height = this.canvas.height - margin * 2;
    let global_max = 0;
    network.levels.forEach((level) => {
      global_max = Math.max(
        global_max,
        level.inputs.length,
        level.outputs.length
      );
    });
    const padding = 10;
    const node_radius = (width - (global_max - 1) * padding) / global_max / 2;

    for (let i = network.levels.length - 1; i >= 0; i--) {
      const level_height = height / network.levels.length;
      const level_top = top + (network.levels.length - 1 - i) * level_height;
      const level_bottom = level_top + level_height;
      this.draw_level(
        network.levels[i],
        level_top,
        level_bottom,
        left,
        width,
        node_radius,
        i === network.levels.length - 1
      );
    }
  }

  draw_level(
    level: Level,
    top_y: number,
    bottom_y: number,
    left: number,
    level_width: number,
    node_radius: number,
    is_out_level: boolean = false
  ) {
    const { inputs, outputs, weights, biases } = level;
    // draw top nodes
    const top_nodes = this.get_node_points({
      left,
      y: top_y,
      number_of_nodes: outputs.length,
      node_radius,
      container_width: level_width,
    });

    // bottom nodes (inputs)
    const bottom_nodes = this.get_node_points({
      left,
      y: bottom_y,
      number_of_nodes: inputs.length,
      node_radius,
      container_width: level_width,
    });

    this.draw_connections(bottom_nodes, top_nodes, weights);

    bottom_nodes.forEach((point, i) => {
      this.draw_circle(point, node_radius, this.get_RGBA(inputs[i]));
    });
    top_nodes.forEach((point, i) => {
      this.draw_circle(point, node_radius, this.get_RGBA(outputs[i]));
    });

    // Draw Bias symbols or labels if needed
    top_nodes.forEach((point, i) => {
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.arc(point.x, point.y, node_radius * 0.8, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.get_RGBA(biases[i]);
      this.ctx.setLineDash([3, 3]); // Visual indicator for bias
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    });

    if (is_out_level) {
      this.draw_output_labels(top_nodes, node_radius);
    }
  }

  private get_node_points(params: {
    left: number;
    y: number;
    container_width: number;
    number_of_nodes: number;
    node_radius: number;
  }) {
    const { left, y, number_of_nodes, node_radius, container_width } = params;
    const points: Point[] = [];
    for (let i = 0; i < number_of_nodes; i++) {
      const t = i / (number_of_nodes - 1 || 1);
      const x = this.lerp(
        left + node_radius,
        left + container_width - node_radius,
        t
      );
      points.push({ x, y });
    }
    return points;
  }

  draw_connections(from: Point[], to: Point[], weights: number[][] = []) {
    from.forEach((from_point, i) => {
      to.forEach((to_point, j) => {
        const weight_value = weights[i] ? weights[i][j] : 0;
        this.draw_line(from_point, to_point, this.get_RGBA(weight_value));
      });
    });
  }

  private draw_output_labels(points: Point[], radius: number) {
    const labels = ["↑", "←", "→", "↓"];
    this.ctx.fillStyle = "black";
    this.ctx.font = `${radius}px Arial`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    points.forEach((point, i) => {
      this.ctx.fillText(labels[i], point.x, point.y);
    });
  }

  draw_line(from: Point, to: Point, color: string) {
    const ctx = this.ctx;
    ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);

    ctx.setLineDash([7, 3]);
    ctx.lineDashOffset = -this.dash_offset;

    this.ctx.strokeStyle = color;
    this.ctx.stroke();

    ctx.setLineDash([]);
  }

  draw_circle(center: Point, radius: number, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  // positive values: yellow (255,255,0), negative values: blue (0,0,255)
  get_RGBA(value: number) {
    const alpha = Math.min(1, Math.abs(value) + 0.2);

    const red = value < 0 ? 0 : 255;
    const green = value < 0 ? 0 : 255;
    const blue = value > 0 ? 0 : 255;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
}
