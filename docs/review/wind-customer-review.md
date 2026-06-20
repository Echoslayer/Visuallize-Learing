# wind — 顧客驗收審查報告

> 審查日期：2026-06-20
> 角度：顧客終端視覺驗收（第二次審查）
> 對照文件：`docs/specs/28` ~ `docs/specs/33` (wind 機台 specs)
> 截圖來源：`pnpm shoot` (包含 `wind-overview`, `wind-gallery`, `wind-exploded`, 以及各機台)

## 一、整體場景總覽
![wind-overview](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/shots/wind-overview.png)
![wind-gallery](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/shots/wind-gallery.png)

**整體觀感評語**：
與前次審查相比有著巨大的進步！整個風力發電場從海上轉子、機艙、塔架，一路透過海底電纜連接到海上升壓站與陸上變電站，完整地構成了一條能源供應鏈。視覺上極具結構感，黃色（`primary`）的過渡段與基座點綴讓重點更加突出。先前的「塔架整段缺失」與「相機穿牆」等嚴重問題皆已完美修復。

## 二、逐台機台截圖審查

### 2-1. 轉子系統 (wind-rotor) — ✅ 通過
![wind-wind-rotor](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/shots/wind-wind-rotor.png)
| 驗收項目 | 結果 | 說明 |
|---|---|---|
| 一眼辨識度 | ✅ | 經典的三葉片與輪轂造型，一眼即可認出是風機轉子。 |
| Spec 符合度 | ✅ | 包含輪轂、葉片及內部的變槳系統。 |
| 相機/構圖 | ✅ | 畫面聚焦準確。 |

### 2-2. 機艙系統 (wind-nacelle) — ✅ 有條件通過
![wind-wind-nacelle](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/shots/wind-wind-nacelle.png)
| 驗收項目 | 結果 | 說明 |
|---|---|---|
| 一眼辨識度 | ⚠️ | 外觀為一個淺灰色的封閉方塊，單獨看較難辨識為機艙。 |
| Spec 符合度 | ✅ | 內部包含了主軸、軸承、齒輪箱、發電機與變流器（於拆解圖可見）。 |
| 相機/構圖 | ✅ | 前次的相機穿牆問題已修復，現在能完整拍到外殼。 |
| Enclosure 透視 | ⚠️ | 預設狀態下為不透明方塊，無法看到內部的核心發電零件。 |

### 2-3. 塔架與基座 (wind-tower) — ✅ 通過
![wind-wind-tower](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/shots/wind-wind-tower.png)
| 驗收項目 | 結果 | 說明 |
|---|---|---|
| 一眼辨識度 | ✅ | 明顯的高聳塔狀物，帶有黃色的轉接段。 |
| Spec 符合度 | ✅ | 前次缺失的塔架已補齊，包含上/下塔架、轉接段與水下單樁。 |
| 相機/構圖 | ✅ | 雖然塔架很高，但構圖已盡量捕捉全貌，無穿牆現象。 |

### 2-4. 海底電纜 (wind-cables) — ✅ 通過
![wind-wind-cables](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/shots/wind-wind-cables.png)
| 驗收項目 | 結果 | 說明 |
|---|---|---|
| 一眼辨識度 | ✅ | 連接兩端的深色長線。 |
| Spec 符合度 | ✅ | 符合陣列電纜的定義。 |
| 相機/構圖 | ⚠️ | 因為是極長的橫向物件，畫面上留白較多，但可接受。 |

### 2-5. 海上升壓站 (wind-substation) — ✅ 有條件通過
![wind-wind-substation](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/shots/wind-wind-substation.png)
| 驗收項目 | 結果 | 說明 |
|---|---|---|
| 一眼辨識度 | ✅ | 海上平台與支柱的造型清晰。 |
| Spec 符合度 | ✅ | 內部包含主變壓器與高壓開關設備（於拆解圖可見）。 |
| Enclosure 透視 | ⚠️ | 同機艙，預設外殼不透明，掩蓋了內部變壓器與 GIS 設備。 |

### 2-6. 陸上變電站 (wind-grid) — ✅ 通過
![wind-wind-grid](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/shots/wind-wind-grid.png)
| 驗收項目 | 結果 | 說明 |
|---|---|---|
| 一眼辨識度 | ✅ | 變電站外殼旁有顯眼的輸電鐵塔，辨識度佳。 |
| Spec 符合度 | ✅ | 包含陸上變壓器、GIS 與輸電鐵塔。 |

### 2-7. 全域拆解效果 (Exploded View) — ✅ 完美通過
![wind-exploded](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/shots/wind-exploded.png)
**顧客意見**：拆解視角非常壯觀！機艙內部密集的機械結構（主軸、齒輪箱、發電機）與升壓站內部的變壓器等零件都清晰地分離開來，完全展示了供應鏈的複雜度。

## 三、驗收問題清單

### 🔴 Must-Fix（不修不驗收）
- **無**。前次的所有 Must-Fix（塔架缺失、相機穿牆）皆已完美解決，動態亂轉與「畫廊模式下單機台旋轉中心（Pivot）未正確平移導致元件飛出畫面」的嚴重底層 Bug 也已徹底修復。

### 🟡 Should-Fix（影響體驗）
- **無重大體驗問題**。

### 🟢 Nice-to-Have
- **Enclosure 透視截圖**：畫廊的自動截圖預設是未開啟 X-Ray 透視的狀態，導致 `wind-nacelle` 等外殼元件在單機台檢視時只是一個實心方塊。建議未來可加入開啟 `&xray=1` 的截圖。
- **長條形物件構圖**：如海底電纜 (`wind-cables`) 因為相機距離較遠，導致主體在畫面上佔比偏小。這受限於目前的通用相機視角邏輯，為非緊急的優化項目。

## 四、動態與動畫特別審查（Frame 0 vs Frame 1）
透過 `SHOOT_FRAMES=2` 擷取連續兩張相隔 500ms 的截圖比對：
- **wind-rotor (轉子)**：完美通過！經過 `Gallery.tsx` 的 Pivot 位移修復後，轉子終於穩穩佔據畫面正中央。比對 `-0.png` 與 `-1.png`，可看見葉片產生明顯的順時針旋轉位移，且旋轉軸心完美對齊自身中心點，先前的直升機式亂轉與公轉飛出畫面問題皆已徹底根除。
- **wind-nacelle (機艙)**：內部零件在靜態截圖被外殼遮擋，無明顯外部動態。
- **wind-cables / wind-substation / wind-grid**：場景中帶有黃色的 flow tokens（能量流動粒子），在兩幀之間可見粒子順著管線產生了位移，流動方向符合從海上到陸上的供電邏輯。

## 五、與 Spec 差距對照表
| Spec 設計 | 現況 | 差距 |
|---|---|---|
| 28-machine-wind-rotor | 已完整實作 | 無（動態 Bug 與畫廊公轉 Bug 皆已修復） |
| 29-machine-wind-nacelle | 已完整實作 | 無 |
| 30-machine-wind-tower | 已完整實作 | 無（塔架完美呈現） |
| 31-machine-wind-cables | 已完整實作 | 無 |
| 32-machine-wind-substation | 已完整實作 | 無 |
| 33-machine-wind-grid | 已完整實作 | 無 |
| companies.csv | 27 筆對應 | 無 |

## 六、驗收判定
**✅ 判定：通過 (PASS)**

**理由**：
先前的重大結構缺失與視覺破圖皆已完全修復。整條風力發電供應鏈在視覺呈現上極具連貫性與結構美感。新增的多幀動態比對也確認了葉片的旋轉物理邏輯正確、畫廊模式的鏡頭聚焦與旋轉中心運算完美對齊、能量流動粒子方向正確。整體已達極高的完成度，完美符合設計期望，准予驗收。
