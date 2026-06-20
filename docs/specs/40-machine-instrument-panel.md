# 40-machine-instrument-panel: Instrument & Control Panel

## 1. Description
The **Instrumentation & Control Panel** oversees the fluid processing pipeline. It monitors fluid states via sensors on the main piping and visualizes this data on an HMI display mounted on the control cabinet. It sits off to the side (along the Z-axis) to remain isolated from the primary fluid flow path, forming the "Signal Side."

## 2. Abstraction Design

### Primitives
1. **Control Cabinet (`box`)**: A tall, thin enclosure representing the main electrical/control box.
2. **HMI Display (`box`)**: A flat box mounted on the front door of the control cabinet for operator interaction.
3. **Sensor (`cylinder`)**: A small vertical or horizontal cylinder protruding from the main piping to represent flow/pressure measurements.

### Structure Breakdown
* **Main Part (`instrument-panel`)**: The control cabinet itself.
* **Sub-parts**:
  * `instrument-panel-hmi`: Attached to the front of the cabinet.
  * `instrument-sensor`: Protruding from the main piping, linked conceptually to the panel.

## 3. Animation & Process Flow

### Signal Generation
Unlike main processing nodes, the Instrument Panel does not consume the fluid tokens (e.g., `[Filtered Product]`). Instead, it acts as a generator for `[Control Signal]` tokens.

### Route: Control Route
* **Kind**: `control` (or `main` if UI restricts, but strictly logical side-route).
* **Path**: From the `instrument-sensor` on the main piping to the `instrument-panel`.
* **Token Details**:
  * Token Name: `signal-token`
  * Material: `accent`
  * Flow: Continuous stream indicating data transmission.

## 4. Source / Supply Chain
* **Company**: Endress+Hauser (Private)
* **Role**: Provides instrumentation (sensors) and control solutions for process automation.
