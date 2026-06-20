# 35-machine-storage-tank: Feed Tank Specification

## Overview
The Feed Tank is the starting node of the fluid processing pipeline process. It stores the raw material and outputs the `[Raw Material]` token for the rest of the skid.

## Primitive Combinations (Object Abstraction)
We represent the Feed Tank (`tank-1`) with the following primitive components, according to supply chain structure:

- **Main Body (`tank-1`)**: `cylinder`, large vertical container acting as the base node.
- **Roof (`tank-1-roof`)**: `cone`, top cover of the tank for pressure and weather protection.
- **Supports (`tank-1-leg-1` to `tank-1-leg-4`)**: `cylinder` x 4, structural support legs.
- **Outlet Pipe (`tank-1-outlet`)**: `cylinder`, thin pipe exiting the bottom to feed the next node.

## Token Semantics
- **Generates/Outputs**: `[Raw Material]` token.
