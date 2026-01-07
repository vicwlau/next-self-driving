import { Graph } from "./math/graph";
import { get_nearest_point } from "./math/utils";
import { MouseInput } from "./core/mouse-input";
import { Point } from "./primitive/point";
import { Segment } from "./primitive/segment";
import { ViewPort } from "./view-port";

export class GraphEditor implements BaseObject {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  graph: Graph;
  animation_id: number = 0;

  is_dragging: boolean = false;

  selected_point: Point | null = null;
  hovered_point: Point | null = null;
  intent_segment: Segment | null = null;

  constructor(canvas: HTMLCanvasElement, graph: Graph) {
    this.canvas = canvas;
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context");
    }
    this.ctx = context;

    this.graph = graph;
  }

  start(): void {
    if (this.animation_id !== 0) return; // Already started

    this.loop();
  }

  dispose(): void {
    cancelAnimationFrame(this.animation_id);
    this.animation_id = 0;
  }

  loop = () => {
    this.update();
    this.animation_id = requestAnimationFrame(this.loop);
  };

  update(): void {
    this.clear();
    this.graph.draw(this.ctx);

    if (this.intent_segment && !this.is_dragging)
      this.intent_segment.draw(this.ctx, { color: "blue", dashed: true });

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

    this.update_intent_segment(point);
  }

  handle_mouse_down(point: Point, evt: MouseEvent): void {
    this.is_dragging = true;

    // left click
    if (evt.button === 0) {
      if (this.hovered_point) {
        this.select_and_draw_segment(this.hovered_point);
      }
      // create point and segment
      else {
        const success = this.graph.try_add_point(point);
        if (success) {
          this.select_and_draw_segment(point);
        }
      }
    }

    // right click
    else if (evt.button === 2) {
      // remove point
      if (this.hovered_point) {
        this.remove_point(this.hovered_point);
      }
      // deselect
      else {
        this.selected_point = null;
      }
    }
  }

  private select_and_draw_segment(point: Point) {
    // has selection, then connect segment
    if (this.selected_point)
      this.graph.try_add_segment(new Segment(this.selected_point, point));

    this.selected_point = point;
  }

  private remove_point(point: Point) {
    this.graph.remove_point(point);
    this.hovered_point = null;
    if (this.selected_point?.equals(point)) {
      this.selected_point = null;
    }
  }

  private update_intent_segment(point: Point) {
    if (this.selected_point) {
      // in selection, mode: snap to existing point
      if (this.hovered_point) {
        this.intent_segment = new Segment(
          this.hovered_point,
          this.selected_point
        );
      }
      // in selection, mode: draw segment from selected point
      else {
        this.intent_segment = new Segment(this.selected_point, point);
      }
    }
    // not in selection mode: draw nothing
    else {
      this.intent_segment = null;
    }
  }
}
