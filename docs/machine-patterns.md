# Machine Patterns

可複製的工業機台 primitive 配方。新增供應鏈前先看這份,不要每次從零想形狀。

規則:
- 這是文件級 pattern,不是 engine kit。先複製配方到 `content/*.json`。
- 同一 pattern 在 2+ 新題目重複、JSON 變難維護時,再考慮抽 `src/engine/kit/`。
- 每個節點仍要按供應鏈意義增減部位;不要把 pattern 當固定模型。

機台新增流程:
- `/research-machine <machine>` → `docs/research/machines/<slug>.md`:查用途、外觀、輸入輸出、子系統。
- `/design-machine <slug>` → `docs/specs/<NN>-machine-<slug>.md`:選本檔 pattern,列 primitive 組合。
- `/add-component <slug>`:依 spec 實作到 content,用 `?view=gallery&topic=<topic>&machine=<partId>` 驗。

## Conveyor

用途:主線輸送、產線底座。

Primitive:
- belt: 長扁 `box`
- rollers: 橫向 `cylinder` + `repeat`
- legs: 支腳 `box` 或 `cylinder` + `repeat`

範例:
- `src/content/semiconductor.json` 的 `conveyor`

驗收:
- 看得出方向與承載面。
- 滾輪/支腳用 `repeat`,不要手列。
- 通常 `explode.magnitude:0`,不掛公司卡。

## Process Tool

用途:半導體設備、工業加工站、製程機台。

Primitive:
- main body: 主機箱 `box`
- EFEM/front module: 前端模組 `box`
- load ports: 小 `box` + `repeat`
- chamber: 製程腔 `cylinder`
- exhaust/pipe: 排氣管 `cylinder` 或 `tube`
- panel/screen: 控制面板薄 `box`

範例:
- `src/content/semiconductor.json` 的 `equip`

驗收:
- 不是單方塊;至少看得出裝載埠與製程腔。
- 主節點有 annotation;子部位用 `partOf`。
- 若外殼擋內部,標 `enclosure:true`。

## Factory Cell

用途:廠房/代工站/大型加工節點。

Primitive:
- enclosure: 外殼 `box`
- tools: 小機台 `box` + `repeat`
- overhead rail: 天車/搬運軌 `box`
- special tool: 代表性核心設備 `box/cylinder/cone`

範例:
- `src/content/semiconductor.json` 的 `foundry`

驗收:
- 外殼可用 `enclosure:true` 透視。
- 內部至少有一組重複機台,不是空盒。
- 核心設備用 accent 或不同材質突出。

## Rack

用途:伺服器、電控櫃、下游系統。

Primitive:
- frame: 直立 `box`
- trays/shelves: 薄 `box` + `repeat`
- optional side rails: 細 `box`

範例:
- `src/content/ai-server.json`
- `src/content/datacenter.json`
- `src/content/semiconductor.json` 的 `downstream`

驗收:
- 層板/盤用 `repeat`。
- 外框與內部盤有材質對比。

## Tank / Vessel

用途:儲槽、反應器、油箱。

Primitive:
- body: `cylinder` 或 `box`
- cap/lid: 扁 `cylinder` / `cone` / `box`
- legs/base: `box` 或 `cylinder` + `repeat`
- pipe/nozzle: 小 `cylinder` 或 `tube`

範例:
- `src/content/pipeline.json`
- `src/content/grid.json`

驗收:
- 接管/套管能看出功能方向。
- 若是黑箱外殼,可標 `enclosure:true`。

## Transformer

用途:重電變壓器、電力節點。

Primitive:
- oil tank: 主體 `box`
- bushings: `cone` 或細 `cylinder` + `repeat`
- cooling fins: 薄 `box` + `repeat`
- base/core: 底座/鐵芯 `box`

範例:
- `src/content/grid.json`

驗收:
- 套管與散熱片是辨識重點,不要省。
- 重複件用 `repeat` 或同型部位,不要只放一片。

## Piping Skid

用途:管線製程、流體/氣體輸送。

Primitive:
- pipe: `tube` + `path`
- valve: `cylinder` / 小 `box`
- flange: 扁 `cylinder`
- pump/filter: `box + cylinder`

範例:
- `src/content/pipeline.json`

驗收:
- 管路用 `tube`,不要用細 box 假裝。
- 至少有閥或法蘭讓它不像單純線條。

## Turbine / Rotating Machine

用途:風機、馬達、泵、旋轉設備。

Primitive:
- tower/base: `cylinder`
- nacelle/body: `box`
- hub: `cone` 或 `cylinder`
- blades/rotor: 細 `box` + rotation / repeat

範例:
- `src/content/wind.json`

驗收:
- 葉片/轉子是剪影重點,不可只放機箱。
- 旋轉件用 rotation 明確排成放射狀。
