import { Graph } from "./math/graph";
import { get_nearest_point } from "./math/utils";
import { MouseInput } from "./mouse-input";
import { Point } from "./primitive/point";
import { Segment } from "./primitive/segment";

export class GraphEditor implements BaseObject {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  graph: Graph;
  animation_id: number = 0;

  mouse_input: MouseInput;

  selected_point: Point | null = null;
  hovered_point: Point | null = null;
  is_dragging: boolean = false;

  constructor(canvas: HTMLCanvasElement, graph: Graph) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context");
    }
    this.ctx = context;
    this.graph = graph;
    this.mouse_input = new MouseInput(canvas, { is_remove_context_menu: true });
  }

  start(): void {
    if (this.animation_id !== 0) return; // Already started

    // assign delegates before start
    this.mouse_input.delegate_mouseup = (coords, evt) => {
      this.handle_mouse_up();
    };

    this.mouse_input.delegate_mousemove = (coords) => {
      this.handle_mouse_move(new Point(coords.x, coords.y));
    };

    this.mouse_input.delegate_mousedown = (coords, evt) => {
      this.handle_mouse_down(new Point(coords.x, coords.y), evt);
    };

    this.mouse_input.start();
    this.loop();
  }

  dispose(): void {
    cancelAnimationFrame(this.animation_id);
    this.animation_id = 0;
    this.mouse_input.dispose();
  }

  loop = () => {
    this.update();
    this.animation_id = requestAnimationFrame(this.loop);
  };

  update(): void {
    this.clear();
    this.graph.draw(this.ctx);

    if (this.selected_point)
      this.selected_point.draw(this.ctx, {
        radius: 8,
        color: "blue",
        filled: false,
        dashed: true,
      });

    if (this.hovered_point)
      this.hovered_point.draw(this.ctx, {
        radius: 12,
        color: "blue",
        line_width: 2,
        filled: false,
      });
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  handle_mouse_up(): void {
    this.is_dragging = false;
  }

  handle_mouse_move(point: Point): void {
    this.hovered_point = get_nearest_point(point, this.graph.points);

    if (this.is_dragging && this.selected_point) {
      this.hovered_point = null;
      this.selected_point.x = point.x;
      this.selected_point.y = point.y;
    }
  }

  handle_mouse_down(point: Point, evt: MouseEvent): void {
    this.is_dragging = true;

    // left click
    if (evt.button === 0) {
      if (this.hovered_point) {
        // connect segment
        if (this.selected_point)
          this.graph.try_add_segment(
            new Segment(this.selected_point, this.hovered_point)
          );
        // selection
        else this.selected_point = this.hovered_point;
      }
      // create point and segment
      else {
        const success = this.graph.try_add_point(point);
        if (success) {
          // create segment if there's previously created point
          if (this.selected_point)
            this.graph.try_add_segment(new Segment(point, this.selected_point));

          // assign selection to new point
          this.selected_point = point;
        }
      }
    }

    // right click
    else if (evt.button === 2) {
      // remove point
      if (this.hovered_point) {
        const is_selected = this.hovered_point.equals(this.selected_point);
        this.graph.remove_point(this.hovered_point);
        this.hovered_point = null;

        if (is_selected) this.selected_point = null;
      }
      // deselect
      else {
        this.selected_point = null;
      }
    }
  }
}
