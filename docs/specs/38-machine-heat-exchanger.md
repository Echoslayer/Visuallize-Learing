# 38-machine-heat-exchanger: Heat Exchanger / Reactor Component Specification

## 1. Overview
The Heat Exchanger / Reactor treats or heats the fluid in the processing pipeline. It is represented as a Plate Heat Exchanger sourced from **Alfa Laval (ALFA.ST)**.

## 2. Object Abstraction & Primitives
We construct the plate heat exchanger using the following primitives:

1. **Frames (Front and Back)**
   - **Shape**: `box` x 2
   - **Role**: Thick pressure plates that enclose and compress the plate pack.
   - **Geometry**: Tall, wide, and moderately thick.

2. **Heat Plates**
   - **Shape**: `box` with `repeat`
   - **Role**: Thin corrugated plates for heat transfer.
   - **Geometry**: Tall, wide, but very thin, arrayed along the Z or X axis.

3. **Guide Bars**
   - **Shape**: `cylinder` x 2
   - **Role**: Top and bottom structural beams supporting the plates.
   - **Geometry**: Long and thin cylinders intersecting the top and bottom of the plates.

## 3. Token Semantics
* **IN**: `[regulated-flow]` (Received from Valve Manifold)
* **Process**: Heat Treatment (visualized via color shift / heat effect).
* **OUT**: `[heated-flow]`

## 4. Hierarchy
* `heat-exchanger` (Front Frame, annotated)
  * `heat-exchanger-frame-back` (`partOf: "heat-exchanger"`)
  * `heat-exchanger-plates` (`partOf: "heat-exchanger"`, uses `repeat`)
  * `heat-exchanger-bar-top` (`partOf: "heat-exchanger"`)
  * `heat-exchanger-bar-bottom` (`partOf: "heat-exchanger"`)
