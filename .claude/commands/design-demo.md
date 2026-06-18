# Design Demo
> 接 `/research-supply-chain` 的功課,**做設計決策**:把研究(事實)轉成一個「教學用、抽象、可建模」的 demo 設計。
> 產出設計 spec 到 `specs/`,人類確認後由 `/add-topic` 實作。
> **三段分離:研究=事實 / 設計=取捨 / 建模=實作。** 這支只做中段「怎麼設計」,不查資料、不寫 content。

## Variables
slug: $1 — 研究文件 slug(對應 `docs/supply-chains/<slug>.md`)。

## Instructions
- **先讀** `docs/supply-chains/<slug>.md`(功課)。設計依它的環節/流動/公司,不另外查資料。
- **教學優先、抽象就好**:形狀只用 primitive(box / cylinder / cone / tube / flow),低多邊形、**不精細**。
  目標是「一眼看懂這條供應鏈怎麼運作」,不是擬真。
- **精選必要元件**:研究可能列 N 個環節,但 demo **不必每個都建**。挑教學上**必要**的節點;次要的合併或省略,**寫明取捨理由**。寧可少而清楚。
- **決定設計細節**(這支的重點):
  - **形狀**:每個節點用哪個 primitive,代表什麼。
  - **大小**:相對大小(核心/重要的大一點,引導視覺)。
  - **布局 + 相機**:整體怎麼排(產線橫排 / 堆疊 / 環狀 / 群聚)、場景尺度、相機起手值。
  - **互動**:拆解方向與幅度(怎麼散開最好懂)、哪些是一個可選取/標註的節點(同節點多 primitive 共用 explode)。
  - **物流 / flow**:流什麼、path 走向、速度、是否循環、是否變形(如進料→成品)。沒有實體流動的(純服務鏈)就說明改用什麼表現互動。
- **在引擎能力內設計**:可用 box/cylinder/cone/tube/flow + `repeat`(陣列)+ `rotation` + `model`(GLB,需借素材→先回報)+ explode + annotation + config。**別設計引擎做不到的**;真需要新能力 → 標記為「需先開 schema-change spec」。
- 公司**不在這決定**——指向研究 §4,提醒之後填 `companies.csv`。
- 輸出到 `specs/<NN>-topic-<slug>.md`(NN 接續現有編號)。**不建 content JSON、不碰 engine。**

## Format(產出的設計 spec)
```md
# <產業> demo 設計(topic `<slug>`)

> 由 /design-demo 依 `docs/supply-chains/<slug>.md` 產出。教學用、抽象。人類確認後 /add-topic 建。
- type: topic
- 研究來源:docs/supply-chains/<slug>.md

## 1. 教學目標 + 取捨
<這個 demo 要讓人看懂什麼;從研究的 N 環節挑哪幾個當節點、合併/省略哪些、為什麼>

## 2. 布局 + 相機
<整體排法、場景尺度、相機 position/target 起手值>

## 3. 元件設計
| 節點 id | 抽象形狀 | 相對大小 | 位置(概) | 材質 | 代表什麼 |
|---|---|---|---|---|---|
<每個節點一列;核心節點大一點>

## 4. 互動
- 拆解:每節點 explode 方向/幅度(怎麼散最好懂)。
- 選取/標籤:哪些 primitive 共用一個 annotation 節點。

## 5. 物流 / flow
- 流什麼、path 走向、速度、是否循環/變形;或(無實體流動)用什麼表現互動。

## 6. schema 對應草稿(給 /add-topic)
<parts 清單草稿:每 part 的 shape/args 概念、transform 概念、explode、annotation.title。
companies → 指向研究 §4,填 companies.csv。>

## 7. 待人類確認
<開放的設計取捨,讓人類拍板再實作>
```

## Report
- 回傳 spec 路徑 + 摘要(挑了幾個節點、布局、有無 flow)。
- 提醒:人類確認設計後 → `/add-topic` 依此建 content;公司填 `companies.csv`。
