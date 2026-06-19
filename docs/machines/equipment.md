# 設備 / 材料(Equipment & Materials)研究

> 由 `/research-machine equipment` 產出，供 `/design-machine` 使用。
> 對應半導體供應鏈 `equip`(設備 / 材料)節點:供應製程設備與製程材料給晶圓代工/封測。
> **公司/代號準確性需人類查證**(下方標「需查證」)。

## 1. 用途

這是「賣鏟子的人」節點:不直接做晶片,而是供應做晶片所需的**製程設備**(微影/蝕刻/沉積/CMP/佈植/檢測機台)與**製程材料**(光阻、特殊氣體、CMP 研磨液、濕製程化學品、靶材、光罩/光罩基板、矽前驅物)。它是整線的**側向供應源**:輸出 `supply` 注入晶圓代工(也適用封測)。

## 2. 真實外觀

兩種視覺語彙並陳會最清楚:

- **設備側**:一台代表性製程機台 —— mainframe + EFEM 前端模組 + 多個製程腔體(cluster tool)+ 氣體/排氣管路。
- **材料側**:特殊氣體鋼瓶、化學品/光阻桶、CMP 研磨液桶、光罩盒。

可視化要讀得出「設備 + 材料兩類供應」,不要只放一台機台或一個黑箱。

## 3. 輸入 → 輸出

- **輸入**:鋼材/精密零件、光學元件、化學原料(本節點上游,簡化呈現)。
- **中間物**:組裝完成的製程機台、配製好的製程材料。
- **輸出**:`supply`(設備 + 材料)側向注入晶圓代工/封測。
- **供應鏈流向**:本節點是**源頭**,沒有晶圓類輸入;`supply` 流向 `foundry`(整線側向注入)。

## 4. 關鍵子系統

| 部位 | 功能 | 供應鏈意義 | primitive 提示 |
|---|---|---|---|
| Mainframe / cluster tool | 代表製程設備本體 | 是;設備商(ASML/AMAT/LAM/TEL/KLA) | `box` 機體 |
| EFEM 前端模組 | 晶圓上下料 | 是;設備標準介面 | 扁 `box` |
| 裝載埠 Load Port | FOUP 對接口 | 是 | 小 `box` repeat |
| 製程腔體 Chamber | 蝕刻/沉積反應室 | 是;cluster tool 多腔 | `cylinder` repeat |
| 氣體 / 排氣管路 | 製程氣體與排氣 | 是 | 細 `cylinder` |
| 特殊氣體鋼瓶 | 製程氣體供應 | 是;材料商(Linde/Air Liquide) | 細高 `cylinder` repeat |
| 化學品 / 光阻桶 | 光阻、濕化學品 | 是;材料商(JSR/TOK/信越) | `cylinder` 桶 repeat |
| 光罩盒 | 光罩 / 光罩基板 | 是;光罩(Hoya)/光罩廠 | 薄 `box` |

## 5. 代表公司(需人類查證)

| 公司 | 代號 | 角色 | 備註 |
|---|---|---|---|
| ASML | ASML NL | 微影設備(EUV 獨家) | 需查證 |
| Applied Materials | AMAT US | 沉積/蝕刻/CMP 設備 | 需查證 |
| Lam Research | LRCX US | 蝕刻/沉積設備 | 需查證 |
| Tokyo Electron TEL | 8035 JP | 塗佈/蝕刻設備 | 需查證 |
| KLA | KLAC US | 量測/檢測設備 | 需查證 |
| 家登精密 GUDENG | 3680 TW | EUV 光罩盒/載具 | 需查證 |
| 京鼎精密 | 3413 TW | 半導體設備代工 | 需查證 |
| 中砂 Kinik | 1560 TW | CMP 鑽石碟/研磨 | 需查證 |
| 崇越 Topco | 5434 TW | 半導體材料通路 | 需查證 |
| 信越 / JSR / TOK | — | 光阻 / 材料 | 需查證 |
| Linde / Air Liquide | — | 特殊氣體 | 需查證 |

> root id 仍為 `equip`,companies.csv 既有對應由人類查證版維持。

## 6. 機台級物料流(供 gallery 單機台)

- 本節點是**源頭**:沒有晶圓輸入。
- 內部:原料(灰深/metal-dark)從材料區拉到配製站(短)。
- 站:`equip-dispense` 配製/出貨(dwell 0.4s,短),錨在 mainframe。
- 出:`supply`(設備+材料,灰亮/metal-light)往 fab 方向出。
- in 深灰原料 / out 亮灰 supply 分色;單向。
