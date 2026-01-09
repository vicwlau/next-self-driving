"use client";

import { GraphEditor } from "@/lib/graph-editor";
import { Graph } from "@/lib/math/graph";
import { Point } from "@/lib/primitive/point";
import { Segment } from "@/lib/primitive/segment";

interface ActionBarProps {
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  graph_editor?: GraphEditor;
}
export default function ActionBar({
  canvas,
  ctx,
  graph_editor,
}: ActionBarProps) {
  function save_graph() {
    if (!canvas || !ctx || !graph_editor) return;
    graph_editor.save_graph();
  }

  function reset_graph() {
    if (!canvas || !ctx || !graph_editor) return;
    graph_editor.reset_graph();
  }

  function remove_segment() {
    if (!canvas || !ctx || !graph_editor) return;
    const graph = graph_editor.graph;
    const index = Math.floor(Math.random() * graph.segments.length);
    const segment = graph.segments[index];
    graph.remove_segment(segment);
    refresh_graph();
  }

  function remove_point() {
    if (!canvas || !ctx || !graph_editor) return;
    const graph = graph_editor.graph;
    const index = Math.floor(Math.random() * graph.points.length);
    const point = graph.points[index];
    graph.remove_point(point);
    refresh_graph();
  }

  function add_random_segment() {
    if (!canvas || !ctx || !graph_editor) return;
    const graph = graph_editor.graph;

    const index1 = Math.floor(Math.random() * graph.points.length);
    const index2 = Math.floor(Math.random() * graph.points.length);
    if (index1 === index2) return;

    const s1 = new Segment(graph.points[index1], graph.points[index2]);
    graph.add_segment(s1);
    refresh_graph();
  }

  function add_random_point() {
    if (!canvas || !ctx || !graph_editor) return;
    const random_point: Point = new Point(
      Math.random() * 600,
      Math.random() * 600
    );

    graph_editor.graph.try_add_point(random_point);
    refresh_graph();
  }

  function remove_all() {
    if (!canvas || !ctx || !graph_editor) return;
    graph_editor.graph.reset();
    refresh_graph();
  }

  function refresh_graph() {
    if (!canvas || !ctx || !graph_editor) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graph_editor.graph.draw(ctx);
  }

  return (
    <div className="flex flex-col h-full items-center. justify-center ml-6 gap-y-4">
      {/* <Button onClick={add_random_point}>add point</Button>
      <Button onClick={add_random_segment}>add segment</Button>
      <Button onClick={remove_segment} className="bg-red-600">
        remove segment
      </Button> */}
      <Button onClick={save_graph} className="bg-green-800">
        save graph
      </Button>
      <Button onClick={reset_graph} className="bg-red-600">
        reset graph
      </Button>
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={`active:scale-95 bg-blue-600 text-white px-4 py-2 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
