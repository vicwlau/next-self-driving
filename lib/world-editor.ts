import { DragInput } from "./core/drag-input";
import { MouseInput } from "./core/mouse-input";
import { GraphEditor } from "./graph-editor";
import { Graph } from "./math/graph";
import { Envelope } from "./primitive/envelope";
import { Point } from "./primitive/point";
import { Polygon } from "./primitive/polygon";
import { ViewPort } from "./view-port";

/*
  RESPONSBILITIES:
  - Manage all editors (graph, terrain, etc)
  - Manage view port
  - Manage input (mouse, keyboard, drag)
  - Main update loop, calling update on all sub-editors
*/
export class WorldEditor implements BaseObject {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  mouse: MouseInput;
  drag: DragInput;
  view: ViewPort;
  graph_editor: GraphEditor;

  private _anim_id = 0;
  private _road_width = 100;
  private _road_roundness = 3;
  private _envelopes: Envelope[] = [];
  private _intersections: Point[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    if (!this.ctx) throw new Error("Could not get 2D context");

    canvas.width = 600;
    canvas.height = 600;

    // placeholders
    const p1 = new Point(200, 200);
    const p2 = new Point(500, 200);
    const p3 = new Point(400, 400);
    const p4 = new Point(100, 300);

    this.mouse = new MouseInput(canvas, { is_remove_context_menu: true });
    this.drag = new DragInput(canvas);

    this.view = new ViewPort(canvas);
    this.graph_editor = new GraphEditor(canvas);
  }

  start() {
    // assign delegates before start
    this.init_mouse_events();

    this.mouse.start();
    this.drag.start();
    this.view.start();
    this.graph_editor.start(); // generate points and segments

    if (this._anim_id !== 0) return; // Already started

    this._loop(); // start main update loop
  }

  private _loop = () => {
    this.update();
    this._anim_id = requestAnimationFrame(this._loop);
  };

  private init_mouse_events() {
    /*
      MOUSE EVENTS
    */
    this.mouse.on_move = (coords, evt) => {
      const world_point = this.view.get_world_point(evt);
      this.graph_editor.handle_mouse_move(world_point);
    };
    this.mouse.on_down = (coords, evt) => {
      const world_point = this.view.get_world_point(evt);
      this.graph_editor.handle_mouse_down(world_point, evt);
    };
    this.mouse.on_wheel = (evt: WheelEvent) => {
      this.view.handle_mousewheel(evt);
    };

    /*
      DRAG EVENTS
    */
    this.drag.on_start = (start) => {
      this.view.handle_pan_start();
      this.graph_editor.is_dragging = true;
    };
    this.drag.on_move = (state, evt) => {
      // right drag, pan view
      if (evt.buttons === 2) {
        this.view.handle_pan_move(state.offset);
      }

      // left drag => move point
      else if (evt.buttons === 1) {
        const world_point = this.view.get_world_point(evt);
        this.graph_editor.handle_mouse_drag(world_point);
      }
    };
    this.drag.on_end = (drag) => {
      this.graph_editor.is_dragging = false;
    };
  }

  update() {
    this.view.update();
    this.graph_editor.update();

    this._generate(); // generate the road envelopes from segments
    this._draw();
  }

  private _generate() {
    this._envelopes.length = 0;
    for (const seg of this.graph_editor.graph.segments) {
      this._envelopes.push(
        new Envelope(
          { p1: seg.p1, p2: seg.p2 },
          this._road_width,
          this._road_roundness
        )
      );
    }

    if (this._envelopes.length < 2) {
      this._intersections = [];
    } else {
      this._intersections = Polygon.break(
        this._envelopes[0].polygon,
        this._envelopes[1].polygon
      );
    }
  }

  private _draw() {
    for (const env of this._envelopes) {
      env.draw(this.ctx);
    }
    for (const inter of this._intersections) {
      inter.draw(this.ctx, { color: "red", radius: 5, filled: true });
    }
  }

  dispose(): void {
    this.mouse.dispose();
    this.drag.dispose();
    this.view.dispose();
    this.graph_editor.dispose();
  }
}
