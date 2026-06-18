# 0009 — 視覺參數集中到 config + leva DEV 調參面板(不做產品設置頁)

- 狀態:Accepted
- 日期:2026-06-18
- 相關:[0004](0004-lightweight-agentic-workflow.md)(輕量優先)、[0008](0008-harness-drivable-runtime-state.md)

## Context

label 距離/透明度、燈光、材質手感這些「視覺旋鈕」原本是散在 4 個檔的魔術數字,
每次調都要改碼→build→截圖。需要更好的調參方式。兩條路:
(A) 開發用調參面板;(B) 做給終端使用者的產品設置頁。

評估:label 距離/透明度是**設計決定**,不是使用者偏好——終端使用者不會調這個。
做完整產品設置頁(UI 元件 + 持久化)是過度設計(YAGNI)。真正的痛點是「開發時調參的來回」。

## Decision

1. **集中參數**:所有可調旋鈕進 `engine/config.ts` 的 `useConfig`(zustand)+ `DEFAULT_CONFIG`。
   `materials.ts` 只留顏色;金屬度/粗糙度等手感改為全域 config。元件一律讀 config,不再硬寫數值。
2. **DEV 調參面板用 leva**(pmndrs 生態,新依賴,已獲人類同意)。`ui/Tuning.tsx` 用 `useControls`
   即時寫進 `useConfig`。**只在 App 路由、且 `import.meta.env.DEV` 時 lazy 掛載**。
3. **不做產品設置頁**。調到滿意 → 把數值 bake 進 `DEFAULT_CONFIG`,正式版用預設值。

## Consequences

- ✅ 調參從「改碼→build→截圖」變「拖 slider 即時看」,大幅降低調參成本。
- ✅ 魔術數字集中一處,好維護;材質手感全域一致。
- ✅ 正式版乾淨:`import.meta.env.DEV` 為常數 false → leva 進獨立 lazy chunk(實測 ~201KB),**prod 永不載入**。
- ✅ 面板只掛 App、不掛 Gallery → 自查截圖不被面板污染([[0008]] 的 harness 乾淨)。
- ⚠️ **leva 必須維持 DEV-only**;別把 `<Tuning>` 掛進 Gallery 或拿掉 DEV 守衛,否則污染 prod / 截圖。
- ⚠️ 若哪天真要「使用者可調」的設置(如語言已在 UI、未來可能主題),那是**產品功能**,
   另開 ADR 評估,別把 leva 面板當產品 UI 用。
