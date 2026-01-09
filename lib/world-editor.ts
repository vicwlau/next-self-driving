import { DragInput } from "./core/drag-input";
import { MouseInput } from "./core/mouse-input";
import { GraphEditor } from "./graph-editor";
import { Graph } from "./math/graph";
import { Point } from "./primitive/point";
import { Segment } from "./primitive/segment";
import { Square } from "./primitive/square";
import { ViewPort } from "./view-port";

export class WorldEditor implements BaseObject {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  mouse_input: MouseInput;
  drag_input: DragInput;
  view: ViewPort;
  graph_editor: GraphEditor;
  graph: Graph;

  private animation_id = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    if (!this.ctx) throw new Error("Could not get 2D context");

    canvas.width = 600;
    canvas.height = 600;

    const p1 = new Point(200, 200);
    const p2 = new Point(500, 200);
    const p3 = new Point(400, 400);
    const p4 = new Point(100, 300);

    this.mouse_input = new MouseInput(canvas, { is_remove_context_menu: true });
    this.drag_input = new DragInput(canvas);

    this.view = new ViewPort(canvas);

    this.graph = new Graph([p1, p2, p3, p4], []);
    this.graph_editor = new GraphEditor(canvas, this.graph);
  }

  start() {
    // assign delegates before start
    this.init_mouse_events();

    this.mouse_input.start();
    this.drag_input.start();
    this.view.start();
    this.graph_editor.start();

    if (this.animation_id !== 0) return; // Already started

    this.loop(); // start main update loop
  }

  private loop = () => {
    this.update();
    this.animation_id = requestAnimationFrame(this.loop);
  };

  private init_mouse_events() {
    /*
      MOUSE EVENTS
    */
    this.mouse_input.on_move = (coords, evt) => {
      const world_point = this.view.get_world_point(evt);
      this.graph_editor.handle_mouse_move(world_point);
    };
    this.mouse_input.on_down = (coords, evt) => {
      const world_point = this.view.get_world_point(evt);
      this.graph_editor.handle_mouse_down(world_point, evt);
    };
    this.mouse_input.on_wheel = (evt: WheelEvent) => {
      this.view.handle_mousewheel(evt);
    };

    /*
      DRAG EVENTS
    */
    this.drag_input.on_start = (start) => {
      this.view.handle_pan_start();
      this.graph_editor.is_dragging = true;
    };
    this.drag_input.on_move = (state, evt) => {
      // right drag => pan camera
      if (evt.buttons === 2) {
        this.view.handle_pan_move(state.offset);
      }

      // left drag => move point
      else if (evt.buttons === 1) {
        const world_point = this.view.get_world_point(evt);
        this.graph_editor.handle_mouse_drag(world_point);
      }
    };
    this.drag_input.on_end = (drag) => {
      this.graph_editor.is_dragging = false;
    };
  }

  update() {
    this.view.update();
    this.graph_editor.update();
  }

  dispose(): void {
    this.mouse_input.dispose();
    this.drag_input.dispose();
    this.view.dispose();
    this.graph_editor.dispose();
  }
}
