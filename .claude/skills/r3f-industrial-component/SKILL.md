---
name: r3f-industrial-component
description: 在本專案用 React Three Fiber 程式生成「可拆解的工業/機械 3D 元件」時的領域配方。當任務涉及新增或修改 3D 零件、primitive 幾何、拆解動畫、標註、kit 積木、材質,或執行 /add-component 時使用。
---

# R3F 工業元件配方

在本專案建 3D 元件時遵循。核心原則來自 `docs/plan/CONTEXT.md`:**幾何是程式碼,不是二進位檔。**

## 選型流程(先判形狀,再決定怎麼做)

1. **方正/機械**(機櫃、變壓器、管線、機房)→ 程式生成 primitive(Box/Cylinder/Cone/Tube)。
   - 拼不出來的孔洞/切角 → 用 `three-bvh-csg` 布林運算,不要去 Blender。
2. **精密規律件**(齒輪、螺紋、規律外殼)→ 程式 CAD(CadQuery/OpenSCAD,Python 用 `uv`)產 GLB,當 `kind:"model"`。
3. **有機造型**(飛機、機器人、無人機)→ 借外部低多邊形模型,**整隻當一個零件不細分**。
   素材來源/授權**先回報人類**,不自行下載。

## 寫法守則

- **參數化,不要寫死。** 目標 `<ServerRack rows={6} />`、`<Transformer bushings={3} />`,改一句話就重生。
- **每個子零件**:設 `name` 與 `userData.partId`(穩定 id),拆解與標註靠它定位。
- **累積 kit 積木**:同一種 primitive 拼法出現 ≥2 次 → 抽成 `engine/kit/`(倒角方塊、母線排、螺栓、散熱鰭…程式版 kitbash)。
- **材質走登錄表**:統一畫風的唯一來源是 `engine/materials.ts` + 一組 `<Environment>` 打光。
  不要在元件裡硬塞顏色;新材質先登錄。不同來源(程式畫/借來)靠共用材質視覺拉齊。

## 拆解動畫(數學很短,與題目無關)

每個零件位移 = `normalize(explode.vector) × explode.magnitude`,用 `@react-spring/three` 補間;
`exploded=false` 復位。框體類零件 `magnitude=0` 不動。收合後不可漂移。

## 標註

用 drei `<Html>` 把卡片釘在零件 3D 座標,隨相機移動不脫離。文字讀 `annotation.title[lang]`。

## 硬規則(違反就停下回報)

- 題目字眼(公司名、股票代號、產業名)**只能**進 `content/*.json`,`engine/` 不得出現。
- 要動 `engine/` 才能滿足新題目 → schema 缺口,停下回報,先寫 schema-change spec。
- 新依賴 / 下載外部素材 / 金鑰部署 → 一律停下回報人類。
- 內容準確性(公司對應、代號)由人類查證;agent 起草要標註「需查證」。

## 完成定義

在 `gallery/` 加一格單獨渲染 → 跑 `/verify` → 讀回截圖對照 spec 與 `docs/reference/` → 全綠才 commit。
