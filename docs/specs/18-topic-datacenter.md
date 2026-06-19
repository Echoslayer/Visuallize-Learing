# Datacenter demo 設計(topic `datacenter`)

> 由 datacenter-redo 計畫產出。目標是把早期 repeat 範例升級成資料中心基礎設施供應鏈。

## 目標

讓人看懂一間 AI 機房由五個基礎設施節點協作:機櫃承載運算、電力送入、冷卻帶走熱、網路互連、監控維運。

## 節點

| partId | 節點 | primitive 組合 | 流 |
|---|---|---|---|
| `compute-row` | Compute Rack Row | 地板上一排 rack frame + trays + LED/panel repeat | power/data/cooling 的交會點 |
| `power-room` | Power Room | UPS 櫃、電池櫃、PDU、母線槽 | utility → racks |
| `cooling-loop` | Cooling Loop | CDU/chiller 櫃、pump cylinders、manifold tubes | supply → rack → return |
| `network-fabric` | Network Fabric | spine/leaf switch 櫃、port strips、fiber tubes | racks ↔ switches |
| `monitoring` | Monitoring / DCIM | console desk、screens、status lights | side signal |

## Content 規則

- root 節點才有 annotation/company card。
- 小部位用 `partOf` 指回 root。
- 機櫃、UPS、CDU 等外殼可 `enclosure:true` 供 X-Ray。
- `process` 用三種材質區分:power=`accent`, cooling supply=`chip`, heat return=`heat`, monitoring=`metal-light`。
- 不動 `src/engine`。

## 驗收

- `?view=gallery&topic=datacenter` 一眼看出是機房,不是 12 個單方塊。
- 股票卡有 5 個 root 節點。
- 名稱模式下子部位有名稱並繼承節點。
- X-Ray 可以看穿機櫃/UPS/CDU 外殼。
- power/cooling/data route 有箭頭與 token。
- `pnpm check && pnpm typecheck && pnpm lint && pnpm build` 全綠。

