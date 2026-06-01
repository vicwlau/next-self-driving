"use client";

import { useEffect, useRef, useState } from "react";
import { DrivingGame } from "./driving-game";
import { VisualNetwork } from "./visual-network";

export default function DrivingPage() {
  const [Reset_ID, setReset_ID] = useState(0);
  const canvas_ref = useRef<HTMLCanvasElement | null>(null);
  const network_canvas_ref = useRef<HTMLCanvasElement | null>(null);

  const game_ref = useRef<DrivingGame | null>(null);
  const network_ref = useRef<VisualNetwork | null>(null);

  const [LearningRate, setLearningRate] = useState(0.2);
  const [Difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );

  const traffic_settings = {
    easy: { density: 150, doubleLane: false },
    medium: { density: 100, doubleLane: false },
    hard: { density: 120, doubleLane: true },
  }[Difficulty];

  // driving game class
  useEffect(() => {
    console.log("------ MOUNT ------");
    if (!canvas_ref.current) return;

    const game = new DrivingGame(canvas_ref.current, {
      learningRate: LearningRate,
      trafficDensity: traffic_settings.density,
      doubleLane: traffic_settings.doubleLane,
    });
    game_ref.current = game;
    game.start();

    if (!network_canvas_ref.current) return;
    const network_visual = new VisualNetwork(network_canvas_ref.current, game);
    network_ref.current = network_visual;
    network_visual.start();

    return () => {
      console.log("------ DISMOUNT ------");
      game_ref.current?.dispose();
      network_ref.current?.dispose();
    };
  }, [Reset_ID, Difficulty, LearningRate]);

  return (
    <div className="w-full h-dvh flex gap-4 p-4">
      <canvas
        ref={canvas_ref}
        id="car-canvas"
        className="m-auto bg-gray-500 overflow-hidden"
      ></canvas>
      <div className="flex flex-col items-center justify-center gap-y-4 w-48">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-bold">
            Learning Rate: {LearningRate.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.01"
            max=".2"
            step="0.01"
            value={LearningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-bold">Difficulty</label>
          <div className="flex gap-1 bg-gray-200 p-1 rounded-xl w-full">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-1 rounded-lg text-xs transition-all ${
                  Difficulty === d
                    ? "bg-white shadow text-blue-600 font-bold"
                    : "text-gray-600 hover:bg-gray-300"
                }`}
              >
                {d[0].toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <button
            className="flex-1 h-12 rounded-2xl bg-blue-400 text-white font-bold active:scale-95 transition-transform"
            onClick={() => game_ref?.current?.save()}
          >
            Save
          </button>
          <button
            className="flex-1 h-12 rounded-2xl bg-red-400 text-white font-bold active:scale-95 transition-transform"
            onClick={() => game_ref?.current?.discard()}
          >
            Discard
          </button>
        </div>
        <button
          className="px-2 h-12 rounded-2xl bg-orange-400 text-white font-bold active:scale-95 transition-transform"
          onClick={() => setReset_ID((id) => id + 1)}
        >
          Reset Game
        </button>
      </div>

      <canvas
        ref={network_canvas_ref}
        id="network-canvas"
        className="m-auto bg-black/50 overflow-hidden"
      ></canvas>
    </div>
  );
}
