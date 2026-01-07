import { DragInput } from "./core/drag-input";
import { MouseInput } from "./core/mouse-input";
import { GraphEditor } from "./graph-editor";
import { Graph } from "./math/graph";
import { Point } from "./primitive/point";
import { Segment } from "./primitive/segment";
import { ViewPort } from "./view-port";

export class WorldEditor implements BaseObject {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  mouse_input: MouseInput;
  drag_input: DragInput;
  view_port: ViewPort;
  graph_editor: GraphEditor;
  graph: Graph;

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

    const s1 = new Segment(p1, p2);
    const s2 = new Segment(p2, p3);
    const s3 = new Segment(p3, p4);

    this.mouse_input = new MouseInput(canvas, { is_remove_context_menu: true });
    this.drag_input = new DragInput(canvas);

    this.view_port = new ViewPort(canvas);
    this.graph = new Graph([p1, p2, p3, p4], [s1, s2, s3]);
    this.graph_editor = new GraphEditor(canvas, this.graph);
  }

  start() {
    // assign delegates before start
    this.mouse_input.delegate_mouseup = () => {
      this.graph_editor.handle_mouse_up();
    };

    this.mouse_input.delegate_mousemove = (coords, evt) => {
      const point = this.view_port.get_world_point(evt);
      this.graph_editor.handle_mouse_move(point);
    };

    this.mouse_input.delegate_mousedown = (coords, evt) => {
      const point = this.view_port.get_world_point(evt);
      this.graph_editor.handle_mouse_down(point, evt);
    };

    this.mouse_input.start();
    this.view_port.start();
    this.graph_editor.start();
  }

  dispose(): void {
    this.mouse_input.dispose();
    this.view_port.dispose();
    this.graph_editor.dispose();
  }
}
