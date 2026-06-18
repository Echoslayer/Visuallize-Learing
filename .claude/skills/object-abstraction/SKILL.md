---
name: object-abstraction
description: 把現實世界物件「抽象成可辨識的 primitive 組合」的設計方法論。當要決定一個元件長怎樣、設計供應鏈/工業物件的形狀、做視覺抽象,或執行 /design-demo 時使用。核心:別用單一方塊,組 3~8 個 primitive 抓住真實物件的輪廓。
---

# 物件抽象:真實長相 → 可辨識的低多邊形

設計 demo 元件時用。**抽象 ≠ 簡陋。** 目標是「一眼認得出這是什麼」,用最少的 primitive 抓住真實物件的**視覺特徵**。

## 鐵則

> **不要用單一方塊/圓柱代表一台機器。** 單一 primitive 只在它本身就長那樣時用(一塊板、一根柱)。
> 多數工業物件要 **3~8 個 primitive 組合**,組出可辨識的輪廓。少於 3 通常太粗糙,多於 ~10 就過度精細(教學不需要)。

## 方法(每個元件跑一遍)

1. **調研真實長相**:這東西實際長怎樣?用 WebSearch 查「<物件> 外觀/構造」或回想其照片。
   抓它的**剪影**與**主要量體**(整體比例、最顯眼的部位)。
2. **挑 2~5 個「招牌特徵」**:哪幾個部位讓人一眼認出它?(例:風機=細高塔+機艙盒+三葉;晶圓機台=主機箱+上方 EFEM+側邊裝載埠+製程腔。)
   忽略不影響辨識的細節。
3. **每個特徵 → primitive**:用 box/cylinder/cone/tube(+ `repeat` 做陣列、`rotation` 擺角度)對應。
4. **組合 + 定位**:把 primitive 依真實相對位置/比例擺好(同一節點的 primitive 共用 explode、共用一個 annotation)。
5. **辨識度檢查**:只看剪影認得出嗎?認不出 → 缺了招牌特徵,回第 2 步。

## 抽象程度

- **低多邊形、抓輪廓**,不做螺絲/紋理/銘牌等細節。
- 用**相對大小**引導視覺:核心部位大、附屬小。
- 用**材質對比**(metal-light/dark)分出主體 vs 附件,不靠多邊形數。

## 常見工業物件 → primitive 配方(起手參考,非死規)

| 物件 | 招牌特徵 → primitive 組合 |
|---|---|
| 儲槽 Tank | 圓柱本體 + 頂蓋(扁 cylinder/cone)+ 支腳(細 cylinder ×N repeat)+ 接管(細 cylinder) |
| 塔 Tower(蒸餾/吸收) | 細高 cylinder + 數層平台(扁 cylinder ×N)+ 頂部圓罩 |
| 反應爐/腔體 Chamber | cylinder 容器 + 圓頂蓋(扁 cylinder)+ 數個側埠(小 cylinder) |
| 半導體機台 Tool | 主機箱 box + 上方 EFEM box + 側邊裝載埠(小 box ×2~3)+ 製程腔(cylinder) |
| 輸送帶 Conveyor | 長扁 box(帶面)+ 滾輪(cylinder ×N repeat)+ 支腳(box/cylinder) |
| 變壓器 Transformer | 油箱 box + 高壓套管(cone ×3)+ 散熱片(薄 box ×N repeat)+ 底座 box |
| 機櫃 Rack | 框體 box + 層板/盤(box ×N repeat) |
| 風機 Turbine | 微錐高塔 cylinder + 機艙 box + 鼻錐 cone + 三葉(細 box ×3,rotation 120°) |
| 機械手臂 Robot arm | 底座 cylinder + 數節臂(box)+ 關節(cylinder)+ 夾爪(小 box) |
| 管網 Piping | tube(管)+ 閥(cylinder)+ 法蘭(扁 cylinder)+ 泵(box+cylinder) |
| 天線/雷達 | 拋物面(寬扁 cone/cylinder)+ 支柱(cylinder)+ 饋源(小 box) |

## 與其他工具的關係
- **這支管「設計成什麼形狀」**(WHAT);`r3f-industrial-component` 管「在 R3F 怎麼蓋」(HOW)。
- `/design-demo` 設計每個元件時套用本方法;產出的 spec 每個節點應列出其 primitive 組合,而非單一形狀。
- 真實有機造型(整架飛機/人形)組不出來 → 借 model(GLB),整隻一件(見 ADR-0002)。
