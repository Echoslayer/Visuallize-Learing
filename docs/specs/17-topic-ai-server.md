# AI 伺服器 demo 設計(topic `ai-server`)

> 由 /design-demo 依 `docs/research/supply-chains/ai-server.md` 產出。教學用、抽象。人類確認後 /add-topic（這裡走 ai-server-redo 計畫的 Phase C 逐盤）建。
- type: topic
- 研究來源:docs/research/supply-chains/ai-server.md
- 機台級流機制:已存在(Part.process + ProcessSpec.scale,scale ~0.4),直接重用,不動 engine。

## 1. 教學目標 + 取捨

讓人看懂:**一台 AI 伺服器機櫃是由哪些「盤」組成、誰做哪一塊、盤之間怎麼用電源與資料 fabric 連起來**——而且它是**機櫃互連**,不是輸送帶產線(這是和 semiconductor 最大的差異)。

研究有 9 環節,但**機櫃裡看得到的是「盤」**;上游晶片(HBM/CoWoS/載板/晶圓代工)不是盤,而是**GPU 盤上的子部位 + 掛在 GPU 節點的公司**。節點取捨:

| 研究環節 | demo 處理 | 理由 |
|---|---|---|
| GPU/加速器 | **GPU 運算盤 ×2**(節點) | 機櫃主角,做最詳細 |
| HBM | GPU 盤上的子部位(HBM stack)+ 掛公司 | 不是獨立盤,貼在 GPU 旁 |
| CoWoS/晶圓代工/封測 | 掛在 GPU 節點的公司(無幾何) | 上游製造,非機櫃內物件 |
| CPU | **CPU 運算盤**(節點) | 機櫃內可見盤 |
| NVLink/NVSwitch | **NVSwitch 交換盤**(節點)+ 銅纜背板 | 東西向 fabric 核心 |
| 網路+光收發 | **網路交換盤**(節點) | 南北向對外 |
| 電源 | **電源盤**(節點) | 配電源頭 |
| 液冷 | GPU 盤上的冷板(子部位)+ 機櫃 CDU(系統節點) | 熱在盤上,CDU 在櫃底 |
| ABF載板/PCB/連接 | 各盤的 PCB/連接器子部位 + 掛公司 | 是每盤的地基,非獨立盤 |
| 系統 ODM | **機櫃 / 系統**(節點:rack 框 + CDU) | ODM 整合 + 散熱基建有個家 |

→ **7 個節點**:GPU 運算盤 ×2、CPU 運算盤、NVSwitch 交換盤、網路交換盤、電源盤、機櫃/系統。**精簡的是「盤數」,每個保留節點都做詳細(object-abstraction,部位齊全)。**

## 2. 布局 + 相機

- **直立機櫃(Rack pattern)**:rack-back(背板,含 NVLink 銅纜背板)+ rack-base(底座);盤由上而下水平堆疊(1U slab 沿 Y 疊)。
- 由上而下:GPU 運算盤 01 → GPU 運算盤 02 → CPU 運算盤 → NVSwitch 交換盤(中段,連 GPU)→ 網路交換盤 → 電源盤(底,power shelf)→ CDU(櫃底)。
- 場景尺度:機櫃高約 2.2、寬約 1.2、深約 0.9;盤厚約 0.16,間距約 0.34。
- 相機:`position [2.4, 1.4, 3.0]`、`target [0, 1.0, 0]`(斜前看機櫃正面 + 側面,看得到盤層與背板)。

## 3. 元件設計(每節點是 primitive 組合,非單一形狀)

> 套 object-abstraction:真實是「PCB slab 上放晶片 + 散熱 + 連接器」。每盤 = 一塊板 + 其上有供應鏈意義的零件。

| 節點 id | pattern | primitive 組合(招牌特徵) | 相對大小 | 位置(概) | 材質 | 代表 |
|---|---|---|---|---|---|---|
| `tray-gpu-01` | Rack 盤 | PCB `box`(slab)+ GPU 模組 `box`×2(repeat,Blackwell)+ HBM `box` 小塊(每 GPU 旁 repeat 4)+ 冷板 `box`(蓋上,accent)+ NVLink 連接器 `box`×N(後緣 repeat)+ VRM `box` | 大(主角) | 頂層 y≈1.85 | metal-dark 板 + accent 冷板 | GPU 運算 |
| `tray-gpu-02` | Rack 盤 | 同 01(套同配方,改 id/位置) | 大 | y≈1.5 | 同上 | GPU 運算 |
| `tray-cpu` | Rack 盤 | PCB `box` + CPU socket `box`×2 + DIMM 直立薄 `box`(repeat 6–8)+ VRM `box` + 連接器 | 中 | y≈1.15 | metal-dark + metal-light | CPU 主機 |
| `tray-nvswitch` | Rack 盤 | PCB `box` + NVSwitch ASIC `box`(中,大)+ 散熱蓋 `box` + 高密度連接器 `box`(repeat)+ 銅纜 `tube`×N(往背板) | 中 | y≈0.81 | metal-dark + accent ASIC | NVLink 交換 |
| `tray-network` | Rack 盤 | PCB `box` + 交換 ASIC `box` + 光模組籠 `box`(前面板 repeat 6)+ 埠口小 `box` | 中 | y≈0.47 | metal-dark + metal-light | 網路交換 |
| `tray-power` | Rack 盤/電源 | 機箱 `box` + PSU brick `box`(repeat 4)+ busbar 長 `box`/`cylinder` + BBU `box` | 中 | 底 y≈0.16 | metal-dark + accent busbar | 配電 |
| `rack-sys` | Rack 框 | rack-back 背板 `box`(含 NVLink 銅纜背板薄 `box` + 銅纜 `tube` repeat)+ rack-base 底座 `box` + 側柱 `box`×2 + CDU `box`(櫃底)+ manifold `tube`(直立) | 框(包覆) | 整櫃 | metal-dark 框 | 機構/ODM/散熱 |

> rack-back / rack-base 由現況沿用、併入 `rack-sys` 節點(原本無 annotation → 升為節點掛 ODM/散熱公司)。

## 4. 互動

- **拆解**:盤往**前 + 上下散開**(全域自動放射即可:GPU 盤往上、電源盤往下、各盤往 +z 抽出像抽屜);每盤 magnitude ~1.1–1.4,核心 GPU 盤略大。盤的子部位(GPU/HBM/冷板/連接器)隨盤一起散、各自 magnitude 略大以讀出層次。
- **選取/標籤**:每個節點 = 一個 annotation;盤上的 PCB/GPU/HBM/冷板/連接器等子部位 `partOf` 該盤(繼承名 + 點選顯示盤的公司卡)。`rack-sys` 的背板/底座/CDU partOf rack-sys。
- **透視**:rack 框 / 電源機箱可 `enclosure:true`,看穿內部盤與 busbar。

## 5. 物流 / process / flow

**整機是互連 fabric,分兩層(topic-level process);非閉合跑馬燈。**

### 5a. 整機 topic-level process(兩層)
| token | route | station 停留 | input → output | 說明 |
|---|---|---|---|---|
| power(metal-light)| `power-route`:電源盤 → busbar 往上 → 各盤(沿 Y 上行,stop 在每盤)| 電源盤(源)| AC → DC 發散 | **電源層**,單向上行發散,源頭=電源盤 |
| data(accent)| `data-route`:GPU01 → NVSwitch → GPU02 → 網路盤 | NVSwitch(交換)| 運算 → 交換 → 對外 | **資料層**,單向(運算匯入交換再對外),非 loop |

- 電源層:電源盤是 source station(只 output);route 沿背板/busbar 上行,每個盤一個 stop。
- 資料層:GPU 盤產出資料 → 匯入 NVSwitch(交換 station)→ 出到網路盤(對外);用單向 route 表達,不畫成閉環跑馬燈。
- scale:整機 process 不帶 scale(預設 1,場景大);材質 power=metal-light、data=accent。

### 5b. 機台級 process(每盤,gallery 單盤;reuse Part.process,scale ~0.4)
| 盤 | in | station(dwell)| out |
|---|---|---|---|
| GPU 運算盤 | 資料 in(accent,左)+ 電源 in(metal-light,下,side)| 運算(0.8s)| 資料 out(accent,右)+ 熱 out(chip/紅,上,經冷板)|
| CPU 運算盤 | 資料/PCIe in(accent)+ 電源 in(side)| 處理(0.6s)| 資料 out(accent)|
| NVSwitch 交換盤 | 多路 NVLink in(accent,多 side)| 交換(0.5s)| 多路 out(accent)|
| 網路交換盤 | 封包 in(accent)| 交換(0.5s)| 封包 out(accent,光模組側)|
| 電源盤 | AC in(metal-dark)| 整流(0.4s)| DC out(metal-light)|
| 機櫃/系統 | (選配)冷卻液循環 | CDU(0.5s)| 熱交換循環 |

> 每盤 in/out **材質分色**(電源 metal-light、資料 accent、熱 chip、AC metal-dark);單向;token 過站心、到站 dwell。

## 6. schema 對應草稿(給 Phase C /add-component 逐盤)

> 逐盤走 `/research-machine → /design-machine → /add-component`(ai-server-redo Phase C),每盤再出機台 spec。本節只給 parts 骨架。

- `tray-gpu-01`(root, annotation `GPU 運算盤/GPU Tray`):box slab + partOf 子部位(`tray-gpu-01-pcb`/`-gpu`(repeat)/`-hbm`(repeat)/`-coldplate`/`-nvlink`(repeat)/`-vrm`)+ `process`(機台級,scale 0.4)。
- `tray-gpu-02`:同型,id 換 `-02`。
- `tray-cpu`(annotation `CPU 運算盤/CPU Tray`):slab + socket×2 + DIMM(repeat)+ vrm + process。
- `tray-nvswitch`(annotation `NVSwitch 交換盤`):slab + ASIC + 連接器(repeat)+ 銅纜 tube + process。
- `tray-network`(annotation `網路交換盤`):slab + ASIC + 光模組(repeat)+ 埠 + process。
- `tray-power`(annotation `電源盤`):機箱 + PSU(repeat)+ busbar + BBU + process。
- `rack-sys`(annotation `機櫃 / 系統`):背板 + 銅纜背板 + 底座 + 側柱 + CDU + manifold;enclosure 框。
- 整機 `process`(topic-level):power-route + data-route(兩層,§5a)。
- **companies → 指向研究 §5,填 `companies.csv`**(多對多):GPU 盤→NVDA/AMD/台積2330/SK Hynix/欣興3037/奇鋐3017;CPU 盤→Intel/AMD/NVDA Grace/嘉澤3533;NVSwitch→NVDA/Amphenol/嘉澤3533/貿聯3665;網路→Broadcom/智邦2345/Innolight;電源→台達2308/光寶2301;機櫃→鴻海2317/廣達2382/緯創3231/緯穎6669/英業達2356/技嘉2376 + 散熱奇鋐3017/雙鴻3324。

## 7. 待人類確認

1. **國際代號是否納入 companies.csv**:AI 伺服器沒有 NVIDIA/SK Hynix/Broadcom 會失真。建議**納入關鍵國際公司**(NVDA/AMD/SK Hynix/Micron/Broadcom/Amphenol/Intel),與台股並列。← 需拍板。
2. **節點數 7 個 OK?** 或要把 `rack-sys`(機構/ODM/散熱)拆成兩個(系統機櫃 + 液冷)?目前合併以免節點過多。
3. **整機互連方案**:採 §5a 兩層(power 上行發散 + data 匯入交換)?還是只做機台級流、整機純爆炸看公司?建議兩層。
4. **GPU 盤數**:維持 2 片(教學示意 repeat)?真實 NVL72 有 18 片運算盤。
5. **CDU/液冷**:放 `rack-sys` 當子部位即可,還是要獨立節點?
