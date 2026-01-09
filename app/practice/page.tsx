"use client";

import { useEffect, useRef, useState } from "react";
import { MouseCoords, MouseInput } from "@/lib/core/mouse-input";
import { DragInput, DragState } from "@/lib/core/drag-input";
import { animate_sort, create_sorted_objs } from "./visualize-sort";

export default function PracticePage() {
  const controller = useRef<Controller | null>(null);
  const canvas_ref = useRef<HTMLCanvasElement>(null);
  const [loaded, setloaded] = useState(false);

  useEffect(() => {
    if (canvas_ref.current) {
      const canvas = canvas_ref.current;
      canvas.width = 600;
      canvas.height = 600;

      if (!controller.current) controller.current = new Controller(canvas);
    }

    setloaded(true);
  }, [loaded]);

  return (
    <div className="w-full h-dvh bg-white/80 flex flex-col items-center justify-start p-4 gap-4">
      <div className="text-black">Practice Page</div>
      <canvas className="border border-black" ref={canvas_ref}></canvas>
    </div>
  );
}

interface TestInfo {
  text: string;
  x: number;
  y: number;
  is_hovered?: boolean;
}

class Controller {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  mouse_input: MouseInput;
  drag_input: DragInput;

  animation_id: number = 0;
  text_info: TestInfo[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context");
    }

    this.ctx = context;
    this.mouse_input = new MouseInput(canvas, { is_remove_context_menu: true });
    this.mouse_input.on_up = this.handle_mouse_up;
    this.mouse_input.on_move = this.handle_mouse_move;
    this.mouse_input.start();

    this.drag_input = new DragInput(canvas);
    this.drag_input.on_move = this.handle_drag_move;

    this.drag_input.start();

    const sorted_objs = create_sorted_objs();
    animate_sort(canvas, sorted_objs, 1000);

    // this.loop();
  }

  loop = () => {
    this.update();
    requestAnimationFrame(this.loop);
  };

  private update() {
    this.update_positions();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.text_info.length; i++) {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.arc(this.text_info[i].x, this.text_info[i].y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.arc(this.text_info[i].x, this.text_info[i].y, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (this.text_info[i].is_hovered) {
        ctx.beginPath();
        ctx.arc(this.text_info[i].x, this.text_info[i].y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        ctx.fill();
      }
    }
  }

  private handle_drag_start = (origin: MouseCoords, event: MouseEvent) => {
    console.log("Drag started at:", origin);
  };

  private handle_drag_move = (state: DragState, event: MouseEvent) => {
    if (event.buttons === 2) {
      this.text_info = this.text_info.filter((i) => {
        const distance = Math.hypot(i.x - event.offsetX, i.y - event.offsetY);
        return distance > 20;
      });
    }
  };

  private handle_mouse_up = (coords: MouseCoords, event: MouseEvent) => {
    if (event.button === 2) {
      this.text_info = this.text_info.filter((info) => {
        const distance = Math.hypot(info.x - coords.x, info.y - coords.y);
        return distance > 20;
      });
    } else if (event.button === 0) {
      this.text_info.push({
        text: `Mouse Up at (${coords.x}, ${coords.y})`,
        x: coords.x,
        y: coords.y,
      });
    }
  };

  handle_mouse_move = (coords: MouseCoords, event: MouseEvent) => {
    this.text_info = this.text_info.map((info) => {
      const distance = Math.hypot(info.x - coords.x, info.y - coords.y);
      if (distance < 20) {
        return {
          text: `Hovered! (${info.x}, ${info.y})`,
          x: info.x,
          y: info.y,
          is_hovered: true,
        };
      }
      return {
        text: "not hovered",
        x: info.x,
        y: info.y,
        is_hovered: false,
      };
    });
  };

  draw_text(text: string, x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(text, x, y);
  }

  private update_positions() {
    for (let i = 0; i < this.text_info.length; i++) {
      this.text_info[i].x += 1;
      this.text_info[i].y += 1;

      // bounce off edges
      if (this.text_info[i].x > this.canvas.width) this.text_info[i].x = 0;
      if (this.text_info[i].y > this.canvas.height) this.text_info[i].y = 0;
    }
  }
}
