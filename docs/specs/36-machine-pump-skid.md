# 36-machine-pump-skid: Pump Skid Component Specification

## 1. Overview
The Pump Skid is the primary prime mover in the fluid processing pipeline, responsible for pressurizing fluid. It is sourced from **Flowserve (FLS)**.

## 2. Object Abstraction & Primitives
We construct the pump skid using the following primitives to represent the supply chain parts, avoiding a single monolithic block:

1. **Baseplate**
   - **Shape**: `box`
   - **Role**: Flat bed for the pump and motor, representing the structural foundation.
   - **Geometry**: Wide, deep, and thin.

2. **Motor**
   - **Shape**: `cylinder`
   - **Role**: Horizontal drive unit providing mechanical power.
   - **Geometry**: Long, medium radius, rotated horizontally.

3. **Pump Casing / Volute**
   - **Shape**: `cylinder`
   - **Role**: The fluid chamber attached to the motor.
   - **Geometry**: Short, larger radius than the motor.

4. **Flanges**
   - **Shape**: `cylinder`
   - **Role**: Connection points at the inlet and outlet.
   - **Geometry**: Very short (flat), small radius.

## 3. Token Semantics
* **IN**: `[Raw Material]`
* **Process**: Pressurization (visualized via scale pulse / acceleration).
* **OUT**: `[Pressurized Flow]`

## 4. Hierarchy
* `pump-skid` (Baseplate, annotated)
  * `pump-skid-motor` (`partOf: "pump-skid"`)
  * `pump-skid-casing` (`partOf: "pump-skid"`)
  * `pump-skid-flange-in` (`partOf: "pump-skid"`)
  * `pump-skid-flange-out` (`partOf: "pump-skid"`)
