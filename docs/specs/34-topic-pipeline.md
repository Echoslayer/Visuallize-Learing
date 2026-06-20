# 34-topic-pipeline: Fluid Processing Pipeline (Skid) Demo Specification

## 1. Overview and Scope
* **Scope**: A compact skid: 一座 skid 上排出完整小製程 (A single skid with a complete small process).
* **Concept**: A unified structure showcasing the transformation of fluid from raw feed to filtered product across various supply chain nodes. The entire process is mounted on a single industrial skid base.

## 2. Layout & Routing Direction
* **Orientation**: Single direction, Left to Right (X-axis).
* **Skid Base**: A large rectangular frame serving as the platform for all equipment.
* **Main Process Line (Left to Right)**: 
  1. Feed Tank
  2. Pump Skid
  3. Heat Exchanger
  4. Filter / Separator
  5. Product Tank
* **Interconnections**: Valve manifolds and piping run between each major node.
* **Control Line**: The Instrumentation & Control Panel is placed on the front-side (offset along the Z-axis), running parallel to the main process line to ensure clear visibility and logical separation from the fluid flow.

## 3. Teaching Nodes & Object Abstraction
Every node is constructed using `object-abstraction` principles. We do not use single-block models. Each primitive represents a supply chain or functional necessity.

### 3.1 Feed Tank (Storage Tank) - *CIMC Enric*
* **Function**: Storage for incoming raw material.
* **Primitives**:
  - Main Body: `cylinder` (Large, vertical)
  - Roof: `cone` or flat `cylinder`
  - Supports: `cylinder` x 4 (Legs, representing structural support)
  - Outlet Pipe: `cylinder` (Thin, bottom exit)

### 3.2 Pump Skid - *Flowserve*
* **Function**: Pressurizes the fluid to drive it through the system.
* **Primitives**:
  - Baseplate: `box` (Flat bed for the pump/motor)
  - Motor: `cylinder` (Horizontal, representing the drive)
  - Pump Casing/Volute: `cylinder` (Short, attached to the motor, fluid chamber)
  - Flanges: `cylinder` (Flat, at inlet/outlet connections)

### 3.3 Valve Manifold / Piping - *Emerson Electric / Tenaris*
* **Function**: Regulates and directs fluid flow.
* **Primitives**:
  - Pipes: `tube` or `cylinder` (Connecting segments)
  - Valve Bodies: `cylinder` (Intersecting the pipe)
  - Valve Actuator/Handwheel: `cylinder` or `box` (Top of the valve)
  - Flanges: `cylinder` (Flat, at joints representing pipe fittings)

### 3.4 Heat Exchanger / Reactor - *Alfa Laval*
* **Function**: Heats or treats the fluid (represented as a Plate Heat Exchanger).
* **Primitives**:
  - Frame: `box` x 2 (Front and back thick pressure plates)
  - Heat Plates: `box` x N (Thin plates, using `repeat` for the plate pack)
  - Guide Bars: `cylinder` x 2 (Top and bottom structural beams)

### 3.5 Filter / Separator - *Parker Hannifin*
* **Function**: Removes impurities and separates media.
* **Primitives**:
  - Vessel Body: `cylinder` (Vertical, mid-sized)
  - Bottom Head: `cone` (For drainage/impurity collection)
  - Top Cover: `cylinder` (Flat, representing access/seal)
  - Inlet/Outlet Ports: `cylinder` (Thin, side connections)

### 3.6 Product Tank (Storage Tank) - *CIMC Enric*
* **Function**: Stores the finished filtered product.
* **Primitives**:
  - Main Body: `cylinder` (Large, vertical)
  - Roof: `cone` or flat `cylinder`
  - Supports: `cylinder` x 4 (Legs)
  - Inlet Pipe: `cylinder` (Thin, top entry)

### 3.7 Instrumentation & Control Panel - *Endress+Hauser*
* **Function**: Monitors the skid (Signal side) and issues control signals.
* **Primitives**:
  - Control Cabinet: `box` (Tall, thin enclosure)
  - HMI Display: `box` (Flat, mounted on the front door)
  - Sensors: `cylinder` (Small, protruding from main piping to represent flow/pressure measurement)

## 4. Process Flow Routes (Topic-Level)
* **Main Fluid Route (topic-level process)**: 
  * Tokens travel linearly along the equipment centers.
  * Route: Feed Tank Center → Pump Center → Heat Exchanger Center → Filter Center → Product Tank Center.
  * Visual: Arrows indicating flow direction along the route.
* **Control Route (Signal Side)**: 
  * A separate, side route representing data/signals, strictly isolated from the fluid flow.
  * Route: Sensors on Main Piping → Control Panel.

## 5. Machine-Level Flow Recipe
The animation relies on reusing the `Part.process` + `scale` animation logic. Tokens mutate dynamically as they pass through the supply chain nodes.

* **Token Semantics**:
  * **Feed Tank**: Generates and outputs `[Raw Material]` token.
  * **Pump Skid**: IN: `[Raw Material]` → Process (scale pulse/acceleration) → OUT: `[Pressurized Flow]`.
  * **Valve/Piping**: IN: `[Pressurized Flow]` → OUT: `[Regulated Flow]`.
  * **Heat Exchanger**: IN: `[Regulated Flow]` → Process (color shift/heat effect) → OUT: `[Heated Flow]`.
  * **Filter/Separator**: IN: `[Heated Flow]` → Process (scale change/separation effect) → OUT: `[Filtered Product]`.
  * **Product Tank**: Consumes and stores `[Filtered Product]` token.
  * **Instrumentation**: Reads fluid state (no token consumption), generates `[Control Signal]` token sent along the Control Route to the Control Panel.
