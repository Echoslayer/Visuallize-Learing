# 階段二待辦佇列

由上而下一次拉一項做，每項對應一份 `specs/` 規格，自帶驗收。

## 下一輪

- [ ] 清理 audit 低風險項（見 `docs/reveiw/architecture-audit.md`）：移除 unused assets / stale `explode.vector` / 未使用依賴。
- [ ] 人工校對 `src/content/companies.csv` 的公司 ↔ 元件對應；代號已查證，對應仍需人類確認。
- [ ] 選下一條供應鏈，走 `docs/plan/topic-playbook.md` 三段管線：research → design-demo → add-topic。
- [ ] 視覺優化：若 build chunk 仍過大，再評估 lazy/code-split；沒造成問題先不動。

## 已完成：第一輪 engine 能力驗證

- [x] ① 變壓器（box + bushing 圓柱，純 primitive）→ `grid` topic（spec 01）。engine 未動,首測 cone。
- [x] ② 機房 / 機架陣列（schema `repeat`）→ `datacenter` topic（spec 02）。engine 加 schema/expand/Scene + check-expand。
- [x] ③ 管線（`TubeGeometry`）→ `pipeline` topic（spec 03）。engine 加 tube shape(schema/GeometryFactory)。
- [x] ④ 風機（葉片 primitive，機艙 box）→ `wind` topic（spec 04）。純內容,engine 未動;葉片用 rotation 120°。
- [x] ⑤ 有機件試點：一架飛機（借模型、整隻一零件）→ `aerospace` topic（spec 05）。kind:"model" GLB 載入 + CC-BY attribution。

**第一輪完成**：引擎已驗證 primitive(box/cyl/cone/tube)+ repeat + rotation + model(GLB) 全形態。
