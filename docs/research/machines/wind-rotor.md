# Machine Research: Wind Rotor (轉子與葉片系統)

## 1. 設備概述 (Overview)
轉子系統 (Rotor) 是風力發電機的「能量捕獲端」。它負責將吹過掃掠面積的自然風力，轉換為驅動主軸的機械旋轉動能。轉子系統由三個核心部件組成：
1.  **葉片 (Blades)**: 利用空氣動力學原理產生升力。
2.  **輪轂 (Hub)**: 連接所有葉片並將旋轉力矩傳遞給主軸的鑄件結構。
3.  **變槳系統 (Pitch System)**: 裝在輪轂內部與葉片根部之間，負責微調葉片迎風角度，以最佳化捕風效率並在強風時進行保護。

## 2. 供應鏈環節與代表公司 (Supply Chain)
*   **葉片製造 (Blades)**:
    *   **LM Wind Power** (GE Vernova 旗下) - 全球頂尖葉片商。[需查證: GE]
    *   **TPI Composites** (TPIC) - 最大的獨立複合材料葉片廠。[需查證: TPIC]
*   **輪轂鑄件 (Hub Castings)**:
    *   通常由風機整機廠 (OEMs) 自行設計，交由大型重工鑄造廠生產。[需查證: VWS.CO]
*   **變槳系統與滑環 (Pitch System & Slip Ring)**:
    *   **Moog Inc.** (MOG.A) - 全球變槳系統領導品牌。[需查證: MOG.A]
*   **變槳軸承 (Pitch Bearings)**:
    *   **SKF** (SKF-B.ST) 或 **Schaeffler** (SHA.DE)。[需查證: SKF]

## 3. 能量與訊號流 (Energy & Signal Flow)
*   **Input**: `wind` (從前方吹入的風能)
*   **Output**: `mechanical` (輸出至後方機艙主軸的機械旋轉動能)
*   **內部動作**: 風力推動葉片產生扭矩，扭矩匯集至輪轂中心。
