# 風力發電供應鏈 (Wind Power Supply Chain)

> **狀態**: 草稿 (Draft)
> **注意**: 本文件旨在盤點風力發電產業的關鍵供應鏈環節、代表性公司及其市場地位，作為後續 3D demo 設計與拆解標註的基礎。以下公司名單與股票代號**需人類查證**校對。

## 1. 能量流與訊號流概述

風力發電的本質是**能量轉換鏈**。在後續的架構設計中，必須區分主能量流與控制訊號流。

*   **主能量流 (Energy Flow)**:
    風 (Wind) → 葉片捕能 (Rotor) → 主軸旋轉 (Mechanical) → 齒輪箱加速 (如適用) → 發電機發電 (Electrical AC) → 功率變流器整流/逆變 (Electrical DC/AC) → 機艙內/塔底變壓器升壓 → 陣列電纜 (Collection Cable) → 海上/陸上主升壓站 (Substation) → 輸出電纜 (Export Cable) → 電網 (Grid)。
*   **控制與訊號流 (Control & Signal Flow)**:
    不帶主電力，包含：風速風向感測、變槳控制 (Pitch Control)、偏航控制 (Yaw Control)、狀態監控 (Condition Monitoring)。

---

## 2. 供應鏈關鍵環節與代表公司

以下盤點風機內部至併網端的各個子系統與代表供應商。

### 2.1 葉片材料與成型 (Rotor Blades)
葉片是捕獲風能的關鍵，趨勢為超大型化與碳纖維複合材料應用。
*   **LM Wind Power** (GE Vernova 旗下) - 全球領先的獨立葉片設計與製造商。[需查證: GE]
*   **TPI Composites** (TPIC) - 最大的獨立風機葉片製造商，供貨給多家 OEM。[需查證: TPIC]
*   **Sinoma (中材科技)** (002080.SZ) - 中國最大葉片製造商之一。[需查證]

### 2.2 輪轂與變槳系統 (Hub & Pitch System)
輪轂連接葉片與主軸；變槳系統依據風速調整葉片迎風角度。
*   **Moog Inc.** (MOG.A) - 全球領先的變槳控制系統與滑環 (Slip Ring) 供應商。[需查證: MOG.A]
*   **KEB Automation** - 提供變槳驅動與控制系統。[需查證: 私有]

### 2.3 主軸與軸承 (Main Shaft & Bearings)
承受極大機械應力與旋轉扭矩。
*   **SKF** (SKF-B.ST) - 全球軸承巨頭，提供主軸、齒輪箱及發電機專用軸承。[需查證: SKF]
*   **Schaeffler (FAG)** (SHA.DE) - 另一大工業與風電軸承領導品牌。[需查證: SHA]
*   **The Timken Company** (TKR) - 專精於大型圓錐型滾子軸承。[需查證: TKR]

### 2.4 齒輪箱與直驅技術 (Gearbox / Drivetrain)
將主軸的低速高扭矩轉換為發電機所需的高速旋轉（直驅風機無此部件）。
*   **ZF** (ZF Friedrichshafen) - 全球領先的風電齒輪箱與傳動系統製造商。[需查證: 私有]
*   **Winergy** (Flender 集團) - 行業標竿，專精大型風電齒輪箱。[需查證: 私有]
*   **NGC (南高齒)** (0658.HK) - 全球市占率極高的齒輪箱製造商。[需查證: 0658.HK]

### 2.5 發電機 (Generator)
將機械能轉化為電能（雙饋非同步 DFIG 或 永磁同步 PMSG）。
*   **ABB** (ABBN.SW) - 頂尖發電機製造商。[需查證: ABB]
*   **Siemens** (SIE.DE) - 提供高效能風力發電機。[需查證: SIE]
*   **Ingeteam** - 提供各類型風力發電機與變流器技術。[需查證: 私有]

### 2.6 功率變流器 (Power Converter)
將發電機發出不穩定的電流，轉換為符合電網頻率與電壓要求的穩定電流。
*   **ABB** (ABBN.SW) - 變流器市場的領導者。[需查證: ABB]
*   **Ingeteam** - 專注於風電變流與控制技術。[需查證: 私有]
*   **Danfoss** - 提供風機專用的功率模組與變流器組件。[需查證: 私有]
*   **Delta Electronics (台達電)** (2308.TW) - 提供風電全功率變流器與相關零組件。[需查證: 2308.TW]

### 2.7 控制系統與感測器 (Control & Sensors)
風機的大腦，負責監控、SCADA、偏航驅動指令等。
*   **Bachmann electronic** - 風機控制硬體與自動化系統的絕對領先者。[需查證: 私有]
*   **KK Wind Solutions** - 專業風電控制系統與配電整合商。[需查證: 私有]

### 2.8 塔架 (Tower)
支撐機艙與葉片，多為鋼製管狀結構。
*   **CS Wind** (112610.KS) - 全球最大的風機塔架製造商。[需查證: 112610.KS]
*   **Broadwind** (BWEN) - 美國重型鋼結構與塔架製造商。[需查證: BWEN]

### 2.9 基礎結構 (Foundation - Monopile / Jacket)
特別是離岸風電的水下基礎（單樁、套筒），製造難度極高。
*   **Sif Group** (SIFG.AS) - 荷蘭商，全球最大的單樁 (Monopile) 製造商之一。[需查證: SIFG.AS]
*   **EEW Group** - 德國巨頭，專注於大直徑鋼管與離岸單樁。[需查證: 私有]
*   **SeAH Wind** (SeAH Steel 旗下) - 積極擴建離岸單樁產能的韓國大廠。[需查證: 003030.KS]

### 2.10 海底電纜與陸纜 (Cables - Array & Export)
負責將風場電力收集（陣列電纜）並輸送至陸地電網（輸出電纜）。
*   **Prysmian Group** (PRY.MI) - 全球最大電纜製造商，離岸風電市占領先。[需查證: PRY.MI]
*   **Nexans** (NEX.PA) - 提供高壓海纜與 turnkey 鋪設方案。[需查證: NEX.PA]
*   **NKT** (NKT.CO) - 丹麥商，專精高壓與超高壓海纜系統。[需查證: NKT.CO]

### 2.11 升壓站 (Substation - Offshore & Onshore)
匯集風機電力並大幅升壓（HVAC 或 HVDC）以減少長距離傳輸耗損。
*   **Hitachi Energy** (前 ABB 電網) - 高壓變壓器與 HVDC 技術領導者。[需查證: 私有/Hitachi]
*   **Siemens Energy** (ENR.DE) - 提供完整的海上變電站與併網技術。[需查證: ENR.DE]
*   **GE Vernova (Grid Solutions)** (GE) - 升壓變壓器與電網連接方案供應商。[需查證: GE]

### 2.12 施工船、吊裝與運維 (Installation & O&M)
離岸風電特有的重資產環節，需要自升式安裝船 (WTIV)。
*   **Cadeler** (CADLR.OL) - 離岸風電安裝與維護船隊巨頭。[需查證: CADLR]
*   **Eneti** (已與 Cadeler 合併) / **Seajacks** - 提供離岸安裝服務。[需查證]

### 2.13 系統整合與整機廠 (Turbine OEMs)
將上述零件組裝並負責最終設計與保固的終端品牌。
*   **Vestas** (VWS.CO) - 丹麥商，全球風機龍頭。[需查證: VWS.CO]
*   **Siemens Gamesa** (Siemens Energy 旗下) - 離岸風電霸主。[需查證: ENR.DE]
*   **GE Vernova** (GE) - 陸上風機與 Haliade-X 離岸風機大廠。[需查證: GE]
*   **Goldwind (金風科技)** (2208.HK) - 中國最大風機製造商。[需查證: 2208.HK]

---
> 下一步：等待人類確認上述公司與分類，然後進入 Phase B 決定 demo 的具體呈現範圍（例如要精選哪些節點來展示）。
