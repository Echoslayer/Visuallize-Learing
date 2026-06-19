# 機房 / 資料中心供應鏈重做計畫

> 目標:把 `datacenter` 從 repeat 範例重做成資料中心基礎設施供應鏈 demo。
> 範圍是機房內可看見/可教學的基礎設施:機櫃、電力、冷卻、網路、監控。

正典仍是 [`CONTEXT.md`](CONTEXT.md)、[`PLAN.md`](PLAN.md)、[`topic-playbook.md`](topic-playbook.md)。本檔只列這次重做的節奏。

## 管線總覽

```
Phase A  研究供應鏈   → docs/supply-chains/datacenter.md
Phase B  設計 demo    → specs/18-topic-datacenter.md
Phase C  建 content   → src/content/datacenter.json + companies.csv
Phase D  驗收         → check/type/lint/build/shoot
```

## 核心取捨

1. **這不是一排機櫃而已。** 機房供應鏈的可見節點是 compute racks、power chain、cooling loop、network fabric、monitoring/DCIM。
2. **不要新增 engine 能力。** 現有 `repeat`、`tube`、`process`、`partOf`、`enclosure` 已夠用。
3. **流分三層。** power、cooling、data 用 topic-level `process` 表達,不把它做成輸送帶產線。
4. **公司資料需查證。** `companies.csv` 只放代表性對應,人類之後校對 ticker/角色。

## 進度追蹤

- [x] Phase A 研究草稿
- [x] Phase B 設計 spec
- [x] Phase C content 重建
- [x] Phase D 截圖驗收
