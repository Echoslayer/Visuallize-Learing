# 機台研究：Tower & Foundation (塔架與水下基礎)

## 1. 現實中的實體結構
塔架與基座是風力發電機的「骨骼與地基」，負責支撐上方重達數百噸的機艙與轉子，並承受極端的風浪載荷。在離岸風電中，水下基礎的工程難度極高。

主要實體結構包含：
1. **塔架 (Tower)**：
   - 通常為多段鋼管結構（Tubular Steel Tower），越往上越細。
   - 內部設有梯子、升降機與電纜通道，將機艙產生的電力往下輸送。
2. **轉接段 (Transition Piece, TP)**：
   - 連接塔架與水下基礎的關鍵結構，通常漆成黃色以符合航海安全規範。
   - 包含工作平台、靠船件（Boat Landing）與 J-tube（供海纜穿入）。
3. **水下基礎 (Foundation)**：
   - **單樁 (Monopile)**：最常見的離岸基礎，為一根巨大的鋼管打入海床。
   - 其他類型包括套筒式 (Jacket) 或浮動式 (Floating)，但在本模型中以單樁為代表。

## 2. 供應鏈映射
根據 `docs/research/supply-chains/wind.md` 與專案既有資料，塔架與基礎的供應鏈如下：
- **塔架 (Tower)**：CS Wind (112610.KS), Broadwind (BWEN), 世紀鋼 (9958.TW)
- **轉接段與基礎 (Foundation/TP)**：Sif Group (SIFG.AS), 世紀鋼 (9958.TW)

## 3. 領域抽象化 (Object Abstraction)
為了符合 3D primitive 與供應鏈展示需求：
- **塔架本體 (`tower`)**：使用多個堆疊的 `cylinder` 或 `cone` 表現下粗上細的結構，代表塔架製造廠。
- **轉接段平台 (`transition-piece`)**：使用黃色的 `cylinder`（扁平圓盤狀）或 `box` 圍繞在塔架底部，代表 TP 與海上施工作業。
- **水下基礎 (`monopile`)**：使用深灰色或生鏽色的 `cylinder` 延伸至地平線以下，代表基座製造廠。

## 4. 能量與物質流 (Process Layer)
- **輸入**：接收來自機艙 (`wind-nacelle`) 的 `electrical-lv` (低壓電能) Token。
- **轉換**：在塔底或 TP 內部通常會有開關設備或塔底變壓器。Token 在此處簡單沿著塔架往下傳遞。
- **輸出**：`electrical-lv` Token 由塔底送出，交給陣列海纜 (`wind-cable`)。
