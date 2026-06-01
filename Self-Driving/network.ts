import { lerp } from "./utils";

export class Level {
  inputs: number[] = []; // value from sensor inputs
  outputs: number[] = [];

  biases: number[] = [];
  weights: number[][] = []; // inputs * outputs

  constructor(input_count: number, output_count: number) {
    this.inputs = new Array(input_count);
    this.outputs = new Array(output_count);
    this.biases = new Array(output_count);

    this.weights = [];
    for (let i = 0; i < input_count; i++) {
      this.weights[i] = new Array(output_count);
    }
    Level.randomize(this);
  }
  // Note: static method enables serialization of an instance;
  // instance methods are not included in serialization because
  // JSON only handles data properties, not executable code like functions
  static randomize(level: Level) {
    // randomize biases (1D)
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }

    // randomize weights (2D)
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1; // random value between -1 and 1
      }
    }
  }

  static feed_forward(given_inputs: number[], level: Level): number[] {
    // assign inputs
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = given_inputs[i];
    }

    // compute outputs
    for (let j = 0; j < level.outputs.length; j++) {
      let sum = 0;
      for (let i = 0; i < level.inputs.length; i++) {
        sum += level.inputs[i] * level.weights[i][j];
      }

      if (sum > level.biases[j]) {
        level.outputs[j] = 1;
      } else {
        level.outputs[j] = 0;
      }
    }
    return level.outputs;
  }
}

export class NeuralNetwork {
  levels: Level[];

  constructor(neuron_counts: number[]) {
    this.levels = [];

    for (let i = 0; i < neuron_counts.length - 1; i++) {
      this.levels.push(new Level(neuron_counts[i], neuron_counts[i + 1]));
    }
  }

  static feed_forward(given_inputs: number[], network: NeuralNetwork) {
    let outputs = Level.feed_forward(given_inputs, network.levels[0]);

    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feed_forward(outputs, network.levels[i]);
    }
    return outputs;
  }

  static mutate(network: NeuralNetwork, amount: number = 1) {
    network.levels.forEach((level) => {
      // mutate biases
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      // mutate weights
      for (let i = 0; i < level.inputs.length; i++) {
        for (let j = 0; j < level.outputs.length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}
