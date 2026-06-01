# SUMMARY

Part of one. See note-resouces for documentation and learnings

# COLOR ACTIVATION MEANING

- `Yellow Lines` (Excitatory): These are positive weights. They represent a "Yes" influence. If a sensor (input) is active, a yellow connection tells the next neuron to "Wake up and turn on."
- `Blue Lines` (Inhibitory): These are negative weights. They represent a "No" influence. If a sensor is active, a blue connection actively tries to "Suppress" the next neuron and keep it turned off.
- `Brightness/Opacity`: This is the Magnitude. A faint line means the network has learned that this specific connection isn't very important. A bright, solid line is a strong rule the car has learned (e.g., "If center sensor is blocked, STOP"). 2. The Nodes (Activations and Biases)
- `Yellow Nodes` (Active): In your code, outputs[j] is set to 1 if sum > bias. A bright yellow node means that neuron is currently "firing" and sending its signal to the next layer.
  `Dashed Circles` (Biases: level.biases[j]): Your code uses biases as the threshold.
  `A Yellow Dash (Positive Bias)`: The neuron is harder to turn on. It requires a lot of "Yellow" input weight to overcome the threshold.
  `A Blue Dash (Negative Bias)`: The neuron is "trigger-happy." It wants to be on by default unless it receives enough "Blue" inhibitory input to shut it down.
