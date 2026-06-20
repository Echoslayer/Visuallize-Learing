# 機台研究：Nacelle Drivetrain (機艙傳動與發電系統)

## 1. 現實中的實體結構
機艙（Nacelle）是風力發電機的「心臟」，安裝於塔架頂部，主要負責將轉子（Rotor）傳來的低速機械能轉換為電能，並控制機組的運行。

其核心實體部件通常依序排列（以常見的雙饋非同步發電機 DFIG 架構為例）：
1. **主軸 (Main Shaft)**：連接輪轂，將葉片的低速旋轉傳遞進機艙。
2. **主軸承 (Main Bearing)**：支撐主軸，承受巨大的徑向與軸向載荷。
3. **齒輪箱 (Gearbox)**：將主軸的低速高扭矩（約 10-20 RPM）轉換為發電機所需的高速低扭矩（約 1500 RPM）。（註：直驅式風機無此部件）
4. **發電機 (Generator)**：將高速機械能轉換為交流電（AC）。
5. **功率變流器 (Power Converter)**：通常位於機艙尾部或塔底，將發電機產生的不穩定電流整流並逆變為符合電網標準的穩定交流電（低壓，通常 690V）。
6. **控制系統 (Control Cabinet)**：機艙內的控制面板，收集感測器數據並控制偏航、變槳與變流。

## 2. 供應鏈映射
根據 `docs/research/supply-chains/wind.md` 的盤點，機艙內各部件對應的供應鏈為：
- **主軸承**：SKF (SKF-B.ST), Schaeffler (SHA.DE)
- **齒輪箱**：ZF (非上市), NGC/南高齒 (0658.HK)
- **發電機**：ABB (ABBN.SW), Siemens (SIE.DE)
- **變流器**：ABB (ABBN.SW), Ingeteam (非上市), 台達電 (2308.TW)
- **控制系統**：Bachmann electronic (非上市)
- **機艙外殼/系統整合**：Vestas (VWS.CO), Siemens Gamesa (ENR.DE)

## 3. 領域抽象化 (Object Abstraction)
為了符合「供應鏈層次」與「幾何 primitive」的原則：
- **機艙外殼 (Nacelle Housing)**：作為承載所有內部部件的容器，代表系統整合廠（如 Vestas）。可使用 `box` 幾何。
- **主軸與軸承 (Main Shaft & Bearing)**：代表軸承供應鏈。使用長 `cylinder` 結合較寬的短 `cylinder`。
- **齒輪箱 (Gearbox)**：代表傳動供應鏈。使用較大的 `box`。
- **發電機 (Generator)**：代表發電機供應鏈。使用大 `cylinder`。
- **變流器與控制櫃 (Converter & Control)**：代表電力電子與控制供應鏈。使用 `box`，通常放置於發電機後方。

## 4. 能量與物質流 (Process Layer)
- **輸入**：來自前端 Rotor 的 `mechanical`（機械能）Token。
- **轉換**：
  - 在齒輪箱（或發電機前段）停留，象徵機械能的加速傳遞。
  - 進入發電機，轉換為 `electrical-lv`（低壓電能）Token。
  - 經過變流器，進行穩定化處理（停留）。
- **輸出**：`electrical-lv` Token 往下送入塔架（Tower）。
