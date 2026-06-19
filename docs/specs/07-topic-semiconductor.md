# 半導體 demo 設計(topic `semiconductor`)

> 由 /design-demo 依 `docs/research/supply-chains/semiconductor.md` 產出。教學用、抽象。
> (本題目已實作;此 spec 為設計示範 + 設計依據文件。)
- type: topic
- 研究來源:docs/research/supply-chains/semiconductor.md

## 1. 教學目標 + 取捨
讓人一眼看懂「**一片晶圓如何走過供應鏈變成晶片**」。
- 研究有 6 環節:設計 / 矽晶圓 / 設備材料 / 晶圓代工 / 封測 / 下游 → **全保留為節點**,因為各自是獨立的投資主題與製程角色,合併會失教學意義。
- **省略**:研究 §3 提的「代工內部數百道製程循環」不逐道建(太細);用 flow 在產線上「跑+循環」**象徵**即可。
- **抽象**:每環節用一個機台方塊代表,不細究廠內設備。

## 2. 布局 + 相機
- **產線橫排**(左→右 = 供應鏈流向),一條輸送帶當主軸,六個機台立在帶上。讀法符合「上游→下游」。
- 場景尺度:帶長 ~9 單位,六節點間距 ~1.44。
- 相機:`position [2, 4.2, 9.5]`、`target [0, 1, 0]`(前上方廣角看整條線)。

## 3. 元件設計(每節點 = primitive 組合,套 object-abstraction;細節跟供應鏈意義)
> 2026-06-19 用 `object-abstraction` 重做細:每個節點拆成有供應鏈意義的部位,非單方塊。
> 同節點各 primitive 共用 explode;annotation 掛在主部位(id = 節點名),其餘 `-suffix` 為 null。

| 節點 | primitive 組合(招牌特徵 → 供應鏈意義) |
|---|---|
| conveyor(產線) | 帶面 box + 滾輪 cylinder ×9(`repeat`)+ 支腳 box ×5(`repeat`) |
| ① design(IC 設計) | 控制台 box + 螢幕 box(傾斜)+ **光罩/reticle**(薄 box,accent=設計輸出) |
| ② wafer(矽晶圓) | **晶柱** cylinder + **晶圓片** 薄 cylinder ×3(`repeat`)+ 卡匣 box |
| ③ equip(設備/材料) | 主機箱 box + EFEM box + **裝載埠** box ×3(`repeat`)+ 製程腔 cylinder + 排氣管 cylinder |
| ④ foundry(晶圓代工,核心最大) | 廠房 box + 機台陣列 box ×4(`repeat`)+ 微影機 box + **鏡頭** cone(accent)+ 天車軌 box |
| ⑤ osat(封裝測試) | 封裝機 box + **載板/ABF** 薄 box(accent=欣興等)+ 打線臂 cylinder + 測試機 box + 測試座 box ×2(`repeat`) |
| ⑥ downstream(下游) | 機櫃框 box + 伺服盤 box ×4(`repeat`) |
| wafer-flow | **flow** 藍球 ×12 沿產線循環(accent) |

## 4. 互動
- **拆解**:六機台一律向上抬(explode `[0,1,0]`,核心 foundry 抬最多 0.85,其餘 0.5~0.7)→ 像把產線「拉開檢視」。輸送帶與 flow 不動。
- **選取/標籤**:六機台各自一個 annotation 節點(一節點一機台);flow 不可選、無標籤(純運動)。

## 5. 物流 / flow
- 流「晶圓」:12 顆藍球沿**閉合迴圈** path(產線上方前緣 ↔ 後緣)持續跑、循環。
- 速度慢(speed 0.12,~8 秒一圈),小球 radius 0.09。
- **變形(未做,可選)**:過 osat 後把「晶圓」變「晶片」(換色/形)→ 教學上更完整;目前統一藍球。

## 6. schema 對應草稿(已實作於 content/semiconductor.json)
- parts:conveyor(box)+ 6 節點(5 box + 1 cylinder)+ wafer-flow(shape `flow`, path 閉合矩形, count 12, speed 0.12)。
- companies → 研究 §4,已填 `companies.csv`(semiconductor 六節點各 1~3 家,代號查證)。

## 7. 待人類確認
- 六節點橫排 + 半透明標籤 → 展開時標籤略重疊。可考慮:標籤上下交錯、或節點減到 4~5 個。
- 要不要做「晶圓→晶片」過 osat 變形?(需 flow 支援分段換材質,屬小型 schema 增強)。
- 「設備/材料」是否併入「晶圓代工」以減節點?(目前分開,因設備是獨立投資主題)。
