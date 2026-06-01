# next-self-driving

An interactive 2D world / road-network editor built with Next.js, React, and the HTML Canvas API. It's a learning project exploring graph-based geometry, canvas rendering, and the foundations for a self-driving car simulation.

This project follows the [Self-driving car simulation playlist](https://www.youtube.com/playlist?list=PLB0Tybl0UNfZtY5IQl1aNwcoOPJNtnPEO) and reimplements the ideas in TypeScript with a Next.js front end.

## Features

- Draw **points** and connect them with **segments**
- `hovered` and `selected` interaction states
- Drag to move points
- "Intent" preview line for connecting segments or placing a new connected point
- Zoom, drag, and pan the viewport
- Envelope (road-edge) generation around segments
- Save / load the graph to `localStorage`
- Clean separation between the `Graph` (data) and the `GraphEditor` (interaction/rendering)
- A **self-driving car simulation** (`Self-Driving/`) where cars learn to drive using a from-scratch neural network — see below

## Self-driving car & neural network

The `Self-Driving/` directory adds a driving simulation where AI cars teach themselves to navigate traffic, powered by a small neural network written from scratch (no ML libraries).

### How the car "sees" and decides

- **Sensors** (`sensor.ts`): each AI car casts 5 rays in a 45° fan ahead of it. Every ray measures how close the nearest road border or traffic car is, producing a reading between `0` (far) and `1` (touching).
- **Brain** (`network.ts`): those 5 readings feed a `NeuralNetwork` shaped `[5, 6, 4]` — 5 sensor inputs, one hidden layer of 6 neurons, and 4 outputs mapping to **forward / left / right / backward**. Each `Level` does a feed-forward pass: it computes a weighted sum of its inputs and fires (`1`) only when that sum clears the neuron's `bias` threshold (otherwise `0`).
- **Control loop** (`car.ts`): every frame the sensor readings are fed forward through the brain, and the four binary outputs are wired directly to the car's controls.

### How it learns

Training uses mutation rather than backpropagation:

- 1000 AI cars spawn at once (`const.ts`), each with a slightly mutated copy of the brain.
- The **best car** is whichever has driven furthest. Click **Save** to persist its brain to `localStorage`; on the next run every car loads that brain and all but the best are mutated by the **learning rate** (`NeuralNetwork.mutate`). Repeat to evolve better drivers. **Discard** clears the saved brain to start fresh.

### Visualizing the decision in real time

`visual-network.ts` renders the best car's brain live on a side canvas, so you can watch *why* it makes each decision:

- **Connections** are colored by weight — **yellow** = positive/excitatory ("turn the next neuron on"), **blue** = negative/inhibitory ("suppress it"). Line **brightness** reflects the weight's magnitude (how strong a rule the car learned).
- **Nodes** light up yellow when that neuron is firing; the dashed ring around each output node visualizes its **bias** (activation threshold).
- The four output nodes are labeled with arrows (`↑ ← → ↓`) so you can see which control is engaged at any moment.

The driving page (`page.tsx`) wires this together with UI controls for **learning rate**, **difficulty** (traffic density / double lanes), plus **Save**, **Discard**, and **Reset**.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run eslint
```

## Project structure

```
app/                Next.js app router (page, layout, styles)
component/          React UI components (e.g. ActionBar)
lib/
  core/             Reusable input handlers (mouse-input, drag-input)
  math/             Graph data structure and math utilities
  primitive/        Geometry primitives (point, segment, polygon, envelope, square)
  sandbox/          Standalone demos (e.g. radian visualizer)
  world-editor.ts   Top-level editor wiring canvas, viewport, and graph editor
  graph-editor.ts   Graph interaction and rendering logic
  view-port.ts      Camera: zoom / pan / coordinate transforms
Self-Driving/       Self-driving car sim: car, sensor, neural network, visualizer
documentation/      Development notes
```

The `lib/core` and `lib/primitive` folders are written to be reusable across other canvas projects.

## Notes

A few concepts worth highlighting from building this:

- **Radians** measure angles by the geometry of a circle itself (a full circle is `2π`), which makes calculus cleaner — `d/dx sin(x) = cos(x)` only holds in radians.
- **Loading classes into components**: a ref-held class may not exist on the first render, so a `loaded` state flag is used to re-render once it's constructed (see `ActionBar`).
- **Segment edge cases**: a segment can't have two identical endpoints; removing a point must also remove every segment that touches it; removing a segment uses `findIndex` + `splice` only when the index is found.
- **Save / load ownership**: `Graph.load()` acts as a factory that rebuilds the references between segments and points (segments must reuse the same point instances). The decision of *where* to persist (`localStorage`) lives in the editor, not the graph.

## License

[MIT](./LICENSE) © Victor Lau
