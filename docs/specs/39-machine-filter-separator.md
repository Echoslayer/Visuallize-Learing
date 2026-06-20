# 39-machine-filter-separator

## 1. Description
This specification details the design and primitive breakdown of the Filter/Separator skid component, which represents Parker Hannifin's filtration technology within the pipeline process.

## 2. Abstraction Design (Primitives)
We use basic geometric primitives to model the filter/separator, emphasizing its industrial function rather than intricate details:
- **filter-separator (Group / Main Annotation)**: Serves as the anchor for the component and its animation logic.
- **filter-separator-body**: `cylinder` (Vertical, mid-sized) - The main pressure vessel where filtration occurs.
- **filter-separator-bottom**: `cone` - Bottom head for drainage and impurity collection.
- **filter-separator-top**: `cylinder` (Flat) - Top cover representing the access hatch for filter replacement.
- **filter-separator-inlet**: `cylinder` (Thin, horizontal) - Inlet port connecting from the heat exchanger.
- **filter-separator-outlet**: `cylinder` (Thin, horizontal) - Outlet port connecting to the product tank.

## 3. Token Semantics & Process Route
- **Input**: `[Heated Flow]`
- **Process**: The fluid token enters the filter. A scale mutation or color adjustment signifies the removal of impurities and phase separation.
- **Output**: `[Filtered Product]`
- **Route**: Fluid travels from the Heat Exchanger output (x = 1.15) to the Filter Center (x = 1.4), undergoes the `filter-process`, and then moves toward the Product Tank (x = 1.75+).
