# schema 變更:process layer(產線語意)

> 由半導體 demo 實機檢查得出:閉合 `flow` 小球看起來像裝飾跑馬燈,不像產線。
- type: schema-change
- 動到:`engine/schema.ts`、`engine/ProcessLayer.tsx`、`engine/process-motion.ts`、`tools/check-process.ts`。

## 動機

產線不是一條曲線,而是「物料 token → 單向 route → station 停留加工 → output 變化」。
原 `flow` 只能表達循環粒子,無法表達加工站、側向注入、晶圓變晶片。

## 設計

在 `SceneContent` 加 optional `process`:

```ts
process?: {
  stations: { id; partId; processTime?; input?; output? }[]
  routes: { id; path; stops?; material?; kind? }[]
  tokens: { id; routeId; material; count; radius?; duration?; spacing? }[]
}
```

- `station` 錨到既有 `parts[].id`,不複製模型。
- `route.path` 是單向;不閉合,終點後 token 重回起點。
- `stops` 指向 route path 點 + station id;token 到點後依 station `processTime` 停留。
- `ProcessLayer` 畫 route tube + arrow + station marker + token。
- `flow` 保留給非語意循環流動,不刪舊能力。

## 半導體套用

- `wafer-route`:矽晶圓 → 晶圓代工 → 封測。
- `chip-route`:封測 → 下游。
- `supply-route`:設備/材料側站 → 晶圓代工。
- token 數量少量化,避免像裝飾粒子。

## 驗證

- `pnpm check` 包含 `tools/check-process.ts`:驗 cycle duration、停站鎖值、離站後繼續前進。
- 截圖驗 `?view=gallery&topic=semiconductor`:route 有箭頭、token 穿站心、側向注入不在主線。
