# Design Demo
> 接 `/research-supply-chain` 的功課,**做設計決策**:把研究(事實)轉成一個「教學用、抽象、可建模」的 demo 設計。
> 產出設計 spec 到 `specs/`,人類確認後由 `/add-topic` 實作。
> **三段分離:研究=事實 / 設計=取捨 / 建模=實作。** 這支只做中段「怎麼設計」,不查資料、不寫 content。

## Variables
slug: $1 — 研究文件 slug(對應 `docs/supply-chains/<slug>.md`)。

## Instructions
- **先讀** `docs/supply-chains/<slug>.md`(功課)。設計依它的環節/流動/公司,不另外查資料。
- **先看** `docs/plan/machine-patterns.md`:每個節點先選最接近的機台 pattern,再按供應鏈意義增減部位。
- **套用 skill `object-abstraction`**:每個元件**先調研真實物件長相**,再用 primitive **把有供應鏈意義的部位都組出來——不論大小,沒有上限**。
  **判準是供應鏈意義,不是視覺擬真**:鏈上有對應(材料/零件/製程/供應商)的部位就建;**只略過沒有供應鏈意義的造型細節**(紋理/油漆/椅墊造型/把板子鎖一起的通用五金)。螺絲螺帽看角色——代表扣件商/關鍵功能件就留,純組裝瑣節才省。
  **抽象 ≠ 簡陋,也 ≠ 只建幾塊**;「抽象」只指 primitive、低多邊形的**風格**,**結構要跟著供應鏈一樣細**。
- 形狀只用 primitive(box / cylinder / cone / tube / flow)+ `repeat`(重複的有意義部位廉價堆:鰭片/螺栓排/滾輪/管排)+ `rotation` 組合。
  目標:看剪影認得出 **且** 模型拆得跟供應鏈一樣細,不是一堆積木。
- **精選節點 ≠ 簡化元件**(兩個不同層次):
  - **節點層**:研究可能列 N 個環節,挑教學上必要的當節點、合併重複的,**寫明取捨理由**(這層可精簡)。
  - **元件層**:但**每個保留的節點都要做詳細**(用上面的 object-abstraction,部位齊全)。精簡的是「環節數」,不是「每個物件的細節」。
- **決定設計細節**(這支的重點):
  - **形狀(套 object-abstraction)**:每個節點的 **primitive 組合**(調研真實長相 → 把**有供應鏈意義**的部位都建出來,不論大小;只略過沒供應鏈意義的造型細節;重複部位用 `repeat`)。不是單一形狀、不是只有幾塊。
  - **大小**:相對大小(核心/重要的大一點,引導視覺)。
  - **布局 + 相機**:整體怎麼排(產線橫排 / 堆疊 / 環狀 / 群聚)、場景尺度、相機起手值。
  - **互動**:拆解方向與幅度(怎麼散開最好懂)、哪些是一個可選取/標註的節點(同節點多 primitive 共用 explode)。
  - **物流 / process / flow**:流什麼、path 走向、速度、是否變形(如進料→成品)。產線/物流用 process;非語意循環才用 flow。沒有實體流動的(純服務鏈)就說明改用什麼表現互動。
  - **產線 / process**:若題目是製程或物流,必須把它設計成 `station → route → token`:
    station=加工/停留點,route=單向路線,token=物料。不要只畫閉合跑馬燈。
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

## 3. 元件設計(每節點是 primitive 組合,非單一形狀)
| 節點 id | machine pattern | primitive 組合(招牌特徵) | 相對大小 | 位置(概) | 材質 | 代表什麼 |
|---|---|---|---|---|---|
<每節點列出它由哪幾個 primitive 組成(套 object-abstraction);核心節點大一點>

## 4. 互動
- 拆解:每節點 explode 方向/幅度(怎麼散最好懂)。
- 選取/標籤:哪些 primitive 共用一個 annotation 節點。

## 5. 物流 / process / flow
- 若是產線/物流題目,用 process 語意列:
  | token | route | station 停留 | input → output | 側向注入 |
  |---|---|---|---|---|
  <物料怎麼走、在哪加工、是否變形、側站如何注入主線>
- 若只是裝飾性流動,才用 `shape:"flow"`;說明 path 走向、速度、是否循環/變形。
- 無實體流動的(純服務鏈)用什麼表現互動。

## 6. schema 對應草稿(給 /add-topic)
<parts 清單草稿:每 part 的 shape/args 概念、transform 概念、explode、annotation.title。
companies → 指向研究 §4,填 companies.csv。>

## 7. 待人類確認
<開放的設計取捨,讓人類拍板再實作>
```

## Report
- 回傳 spec 路徑 + 摘要(挑了幾個節點、布局、有無 process/flow)。
- 提醒:人類確認設計後 → `/add-topic` 依此建 content;公司填 `companies.csv`。
