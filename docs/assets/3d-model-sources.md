# 3D 模型素材來源（⑤ 飛機等有機造型用）

只有有機造型（飛機/機器人）才借外部 GLB，**借了不拆**（整隻一個零件）。
守則：agent 不自行下載，**素材選定與授權確認由人類做**。

## 篩選標準

1. **授權 = CC0 或 CC-BY**（CC0 最省事，不必標註來源；CC-BY 要在 README/畫面標出作者）。
   避開 "personal use only"、"editorial"、需付費、或授權不明的站。
2. **格式有 glTF / GLB**（本引擎用 `@react-three/fiber` + drei `useGLTF`，吃 .glb 最順）。
   只有 .fbx / .obj 也行，但要自己轉檔，多一步。
3. **低面數**（low-poly）。這是解說引擎不是寫實渲染，幾千面足夠，檔案小、載入快。
4. **單一物件、置中、面朝 +Z 或 +X**。整模型當一個零件，軸向亂的話要在 content JSON 補 rotation。

## 推薦來源（依好用程度排序）

| 站 | 授權 | 格式 | 備註 |
|----|------|------|------|
| **Quaternius** — quaternius.com | CC0 | glTF/GLB/FBX | 首選。整包 low-poly，風格統一，有 ultimate space/vehicle kits（含飛機）。 |
| **Poly Pizza** — poly.pizza | CC0 / CC-BY（每個標示） | GLB | Google Poly 的接班站，搜 "airplane" 直接給 GLB 下載。注意逐一看授權。 |
| **Kenney** — kenney.nl/assets | CC0 | glTF/FBX/OBJ | 風格極乾淨，有 "Space Kit"、"Pirate Kit" 等，飛機選擇較少但品質穩。 |
| **Khronos glTF Sample Models** — github.com/KhronosGroup/glTF-Sample-Assets | 多為 CC0/CC-BY | glTF/GLB | 規格範例庫，適合先拿來驗 `useGLTF` 載入流程（不一定有合適飛機）。 |
| **Sketchfab**（篩 Downloadable + CC） — sketchfab.com | 逐一標示，多 CC-BY | glTF/GLB | 量最大、品質參差。**務必勾選 license filter**，看清楚每個模型授權。 |

## 建議流程

1. 先去 **Quaternius** 或 **Poly Pizza** 搜 airplane / jet / plane，挑一個 low-poly CC0 的 GLB。
2. 把授權（CC0 還是 CC-BY + 作者名）記下來，CC-BY 的之後要在畫面或 README 標註。
3. 人類下載 → 放進 `public/models/`（或 `src/content/models/`，待 ⑤ spec 決定路徑）。
4. 之後寫 ⑤ schema-change spec：新增 `kind: "model"`（GLB 載入），先 sign-off 再動 engine。

## 待確認（留給人類）

- [ ] 選定哪一個飛機模型？來源網址：
- [ ] 授權類型：CC0 ／ CC-BY（作者：________）
- [ ] GLB 放置路徑（影響 ⑤ spec 的 schema 設計）
