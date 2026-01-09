"use client";
import { WorldEditor } from "@/lib/world-editor";
import { useEffect, useRef, useState } from "react";
import ActionBar from "../component/action-bar";

export default function Home() {
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const world_editor = useRef<WorldEditor | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    /*
      MAIN STARTS
    */
    if (!canvas_ref.current) return;

    ctx.current = canvas_ref.current.getContext("2d");
    world_editor.current ??= new WorldEditor(canvas_ref.current!);
    world_editor.current.start();

    setLoaded(true);

    return () => {
      world_editor.current?.dispose();
    };
    /*
      MAIN ENDS
    */
  }, []);

  return (
    <div className="flex w-full h-dvh justify-center items-center ">
      <canvas className="bg-gray-100" ref={canvas_ref}></canvas>
      <ActionBar
        canvas={canvas_ref.current!}
        ctx={ctx.current!}
        graph_editor={world_editor?.current?.graph_editor}
      />
    </div>
  );
}
