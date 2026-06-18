# 階段二待辦佇列（人類確認後才開始）

由上而下一次拉一項做，每項對應一份 `specs/` 規格，自帶驗收。

- [x] ① 變壓器（box + bushing 圓柱，純 primitive）→ `grid` topic（spec 01）。engine 未動,首測 cone。
- [x] ② 機房 / 機架陣列（schema `repeat`）→ `datacenter` topic（spec 02）。engine 加 schema/expand/Scene + check-expand。
- [x] ③ 管線（`TubeGeometry`）→ `pipeline` topic（spec 03）。engine 加 tube shape(schema/GeometryFactory)。
- [x] ④ 風機（葉片 primitive，機艙 box）→ `wind` topic（spec 04）。純內容,engine 未動;葉片用 rotation 120°。
- [x] ⑤ 有機件試點：一架飛機（借模型、整隻一零件）→ `aerospace` topic（spec 05）。kind:"model" GLB 載入 + CC-BY attribution。

**Backlog 全數完成 🎉** 引擎驗證過 primitive(box/cyl/cone/tube)+ repeat + rotation + model(GLB) 全形態。
