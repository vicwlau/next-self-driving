import React, { useState, useMemo } from "react";

// PascalCase for Types/Interfaces
interface Point {
  x: number;
  y: number;
}

// PascalCase for Component
export default function RadianVisualizer() {
  const [angle_rad, set_angle_rad] = useState<number>(1); // Default to 1 radian

  // Constants
  const radius = 150;
  const center = 200;
  const stroke_width = 4;

  // snake_case for helper functions
  const get_circle_point = (rad_angle: number): Point => {
    return {
      x: center + radius * Math.cos(rad_angle),
      y: center - radius * Math.sin(rad_angle), // Subtract y because SVG y-axis is inverted
    };
  };

  const calculate_arc_d = (start_angle: number, end_angle: number): string => {
    const start = get_circle_point(start_angle);
    const end = get_circle_point(end_angle);

    // SVG Arc flags: large_arc_flag (0 or 1), sweep_flag (0 or 1)
    // If angle > PI, we need the large arc flag
    const is_large_arc = end_angle - start_angle > Math.PI ? 1 : 0;

    // M = Move to start, A = Arc to end
    // A parameters: rx ry x-axis-rotation large-arc-flag sweep-flag x y
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${is_large_arc} 0 ${end.x} ${end.y}`;
  };

  // Generate markers for every whole radian (1, 2, 3...)
  const radian_markers = useMemo(() => {
    const markers = [];
    // We go up to the ceil of the current angle or max 6
    for (let i = 1; i <= Math.floor(angle_rad); i++) {
      markers.push(i);
    }
    return markers;
  }, [angle_rad]);

  const end_point = get_circle_point(angle_rad);
  const start_point = get_circle_point(0);

  return (
    <div className="flex flex-col items-center p-8 font-sans bg-gray-50 rounded-xl shadow-sm max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Radian Visualizer
      </h2>

      {/* Visualization Canvas */}
      <div className="relative">
        <svg
          width="400"
          height="400"
          className="bg-white rounded-full shadow-inner border border-gray-200"
        >
          {/* 1. Base Circle (Faint) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={stroke_width}
            fill="none"
          />

          {/* 2. Reference Line (0 degrees) */}
          <line
            x1={center}
            y1={center}
            x2={start_point.x}
            y2={start_point.y}
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5,5"
          />

          {/* 3. The Active Arc */}
          <path
            d={calculate_arc_d(0, angle_rad)}
            stroke="#3b82f6"
            strokeWidth={stroke_width + 2}
            fill="none"
            strokeLinecap="round"
          />

          {/* 4. The Radius Line (Current Angle) */}
          <line
            x1={center}
            y1={center}
            x2={end_point.x}
            y2={end_point.y}
            stroke="#3b82f6"
            strokeWidth={stroke_width}
          />

          {/* 5. Radian Markers (Ticks at 1, 2, 3...) */}
          {radian_markers.map((r) => {
            const p = get_circle_point(r);
            return (
              <g key={r}>
                <circle cx={p.x} cy={p.y} r={4} fill="#ef4444" />
                <text
                  x={p.x + 10}
                  y={p.y + 10}
                  fontSize="12"
                  fill="#ef4444"
                  fontWeight="bold"
                >
                  {r} rad
                </text>
              </g>
            );
          })}

          {/* Center Point */}
          <circle cx={center} cy={center} r={4} fill="#374151" />
        </svg>

        {/* Floating Label */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <span className="text-3xl font-bold text-gray-800">
            {angle_rad.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500 block">radians</span>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full mt-6 space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>0 rad</span>
          <span>2π rad (≈6.28)</span>
        </div>
        <input
          type="range"
          min="0.01"
          max={Math.PI * 2}
          step="0.01"
          value={angle_rad}
          onChange={(e) => set_angle_rad(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100">
          <strong>Observation:</strong>
          {angle_rad < 1 &&
            " The arc length is currently shorter than the radius."}
          {Math.abs(angle_rad - 1) < 0.1 &&
            " The arc length is now exactly equal to the radius! This is 1 Radian."}
          {angle_rad > 1 &&
            angle_rad < 3.1 &&
            " The arc is longer than the radius."}
          {Math.abs(angle_rad - 3.14) < 0.2 &&
            " You've reached Half a Circle (π radians)."}
          {angle_rad > 6 && " Nearly a full circle (2π ≈ 6.28)."}
        </div>
      </div>
    </div>
  );
}
