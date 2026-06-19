# Agent 迭代紀錄

每輪自查的成敗摘要。失敗時記:查核點、失敗項、推測原因、下一步。

## C0 — 骨架可跑 + 自查 harness ✅
- Vite react-ts scaffold + 鎖定 3D 依賴（fiber9/three/drei/zustand5/spring）。
- harness:gallery 路由（`?view=gallery`）、`tools/shoot.mjs`、scripts(dev/build/typecheck/lint/shoot)、ESLint。
- 自查全綠:typecheck 0、lint 0、build exit 0、shoot 產出 `c0-gallery.png` 讀回確認方塊已渲染。
- 採官方範本版本 vite8/ts6/eslint10(較原訂新),已更新 PLAN §3 並註記。

## C1 — schema 驅動渲染 ✅
- `engine/schema.ts` 定義 content 契約型別(單一事實來源)。
- `content/ai-server.json`:8 parts(rack-back / rack-base / 6 trays),帶 annotation(內容**待人工查證**)。
- `engine/GeometryFactory.tsx`:依 geometry.shape 生成 box(bevel 用 drei RoundedBox)/cylinder/cone,
  每 mesh 設 name+userData.partId。`engine/Scene.tsx` map parts;`SceneRoot` 讀 schema.camera + lookAt。
- 內容載入在組合層(App/Gallery),engine 維持題目無關。tsconfig 加 resolveJsonModule。
- 修正:初版 frame 為實心 box 會遮住 trays → 改成 back panel + base,trays 清楚可見。
- 自查全綠:typecheck/lint/build 0;shoot 讀回確認 8 個零件依資料渲染成機櫃。移除 C0 placeholder TestBox。
- 待辦(後續查核點):材質登錄(C2)、annotation 內容查證、build chunk>500kB code-split。

## C2 — 統一材質 + 打光 + 相機 ✅
- `engine/materials.ts`:材質登錄表(metal-light/metal-dark),統一畫風唯一來源;GeometryFactory 改走登錄表 + castShadow。
- `SceneRoot`:程序化 Environment(drei Lightformer,**不抓外部 HDR**→離線可跑、截圖決定性)、
  directional 軟陰影(2048 map + bias + shadow camera bounds)、透明地面接柔影、OrbitControls(makeDefault,target 讀 schema)。
- 對齊參考產品:背景改霧白(#dadee4)、metal-light 提亮近白,讓柔影清楚可見(原本深色背景看不到陰影)。
- 自查全綠;shoot 讀回 + 對照 docs/references/ → 統一柔影金屬質感、無突兀材質,airy 感與參考一致。
- 待辦:build chunk>500kB code-split、annotation 內容查證。

## C3 — 選取 ✅
- `engine/selection.ts`:zustand store(selectedId/exploded/lang + select/clear/toggleExploded/setLang/resetView)。
- `GeometryFactory`:onClick → stopPropagation + select(id);選取時 meshStandardMaterial 加 emissive 高亮(#2f6df6, intensity 0.55)。
- `SceneRoot`:Canvas onPointerMissed → clear()。
- 自查全綠;Playwright 實際點擊驅動:點 tray→高亮藍、點另一片→高亮切換(僅一片)、點空白→清除,無 pageerror。
- 觀察:底部 power tray(metal-dark)選取時 emissive 對比較弱(深底色),C5 標籤時再評估。

## C4 — 拆解動畫 ✅
- `engine/explode.ts`:`explodeOffset = normalize(vector) × magnitude`(零向量/零 magnitude → 不動)。
- `GeometryFactory`:位置交給 `animated.group`,展開時位移 offset,`@react-spring/three` 補間(tension170/friction24);內層 mesh 不帶 position。
- `Gallery`:讀 URL query(`?exploded=1&lang=&part=`)灌進 store;DEV 暴露 `window.__selection` 供 harness 驅動。
- 驅動驗證:展開→trays 沿各自向量散開、框體(back/base magnitude0)不動;中段截圖證明平滑補間;
  **收合後與初始 byte-identical(shasum 相同)→ 零漂移**;無 pageerror。

## C5 — 標籤投影 ✅
- `engine/Annotation.tsx`:drei `<Html>` 浮動卡片(深色,title[lang] + 公司/代號 chip),`pointerEvents:none` 不擋互動。
- `GeometryFactory`:渲染在 part 的 animated.group 內,錨點在零件右側外緣(展開時不重疊);
  條件 `(selected || exploded) && annotation`;lang 讀 store。
- 驅動驗證:選取(收合)→ 單張卡 + 高亮;展開 → 全部有標註零件出卡;`lang=en` → 標題切英文;
  拖曳旋轉 → 卡片仍貼著各自零件(Html 追蹤錨點),無脫離;無 pageerror。畫面已高度貼近參考產品。
- ⚠️ annotation 內容(公司/代號)仍是我先填的,**待人工查證**(守則)。

## C6 — 最小 UI 殼 ✅(階段一 DoD 達成)
- `src/ui/Controls.tsx`:底部 pill 工具列三顆按鈕(拆解/收合、重置視角、中/EN),全接 store;文案隨 lang 切換。
- `selection.ts` 加 `resetNonce`;`SceneRoot` 內 `CameraController` 監聽 nonce → OrbitControls.reset() 復位相機(DOM 按鈕無法直接碰 controls)。
- App 掛 `<Controls/>`。
- 驅動驗證(真點 DOM 按鈕):拆解→展開+標籤;中/EN→英文;旋轉後重置→收合+相機回 home+清選取;
  視窗 380px→工具列 flexWrap 不破版;無 pageerror。
- **DoD**:`grep -riE "伺服器|台積|2330|NVIDIA|供應鏈|股票" src/engine` 為空 → engine/content 分離守住。

---
## 階段一完成 🎉
一個 AI 伺服器機櫃垂直切片:旋轉/點選/拆解/標籤/中英,全由 content/ai-server.json 驅動。
停下等人類確認,不自行開始階段二(PLAN §10)。待辦:annotation 內容查證、build chunk code-split。

## 階段一回饋修正(人類驗收意見)✅
1. 標籤遮擋 → 卡片外移(anchor halfW+1.25)+ drei `<Line>` 引線連回零件;不再貼著零件。
2. 拆解穿模 → content 所有 tray explode 向量改為 `[0,1,0.2]`(一律向上),magnitude 由上而下遞減,
   全部沿地板往上展開,無零件沉到地板下。
3. 燈光怪 → 降 metalness(light 0.5→0.15、dark 0.6→0.2)+ 升 roughness 至 0.6(偏 matte);
   加 hemisphereLight 均勻補光、降 directional 至 1.0、Environment Lightformer 改對稱配置,消除不均高光。
- 自查:typecheck/lint/build 全綠;shoot 收合+展開讀回確認三點都改善,貼近參考產品。

## 調參設置:config 集中 + leva DEV 面板 ✅(ADR-0009)
- `engine/config.ts`:`useConfig` zustand + `DEFAULT_CONFIG`(labelDistance/Opacity、ambient/hemisphere/directional、metalness/roughness)。
- `materials.ts` 只留顏色;手感改全域 config。GeometryFactory/SceneRoot/Annotation 一律讀 config。
- `ui/Tuning.tsx`:leva `useControls`→config,**僅 DEV、僅 App 路由 lazy 掛載**;暴露 `window.__config` 供驅動。
- 加依賴 leva(人類同意)。正式 build:leva 進獨立 lazy chunk(~201KB),`import.meta.env.DEV` 為 false → prod 不載入。
- 驗證:App 出現 leva 面板(7 旋鈕);驅動 config(metalness0.95/ambient0.05/labelDist2.4)場景即時改變;Gallery 不受污染;無 pageerror。
- 追加「複製到 config」按鈕(leva `button()`):把目前值組成 `DEFAULT_CONFIG` 片段複製到 clipboard + console,貼回 `engine/config.ts` 即 bake。
  驗證:改值後點按鈕,clipboard/console 拿到反映現值的片段,無 pageerror。

---
# 階段二
## ① 變壓器 / grid topic ✅(spec 01,走 /add-topic)
- 新檔:`content/grid.json`(變壓器:tank/lid/core/3 cone 套管/3 fin 散熱器,共 10 parts)、
  `content/registry.ts`(topic 註冊表,組合層)。改 App/Gallery 讀 `?topic=`。
- **engine 一行未改**(`git diff --stat src/engine` 為空)——驗證 engine/content 分離。
- 首次實測 **cone primitive**(套管)渲染正常。同節點多 primitive 共用 explode 一起動(3 套管、3 散熱片)。
- 拆解微調:core 改 `[-0.9,1,0.2]` 往上+左,與套管分離成獨立節點、標籤不重疊。
- 驗證:`?topic=grid` 變壓器、展開供應鏈拆解、標籤正常;`?topic=` 省略仍是 AI 伺服器(無回歸);typecheck/lint/build 全綠。
- ⚠️ 重電公司/代號(華城1519/中鋼2002/士電1503/中興電1513)為占位,**待人工查證**。

## ② 機房陣列 / repeat schema-change ✅(spec 02,人類已 sign-off)
- schema 加 `Repeat {count, step}` + `Part.repeat?`(向後相容)。新 `engine/expand.ts` 純函式展開。
  `Scene.tsx` 改用 `expandParts`。**engine 只動 schema/expand/Scene 三處**(git diff 確認)。
- `tools/check-expand.ts`(`pnpm check` 串接):無 repeat 不變、count3 展開 id/position、count 1/0 邊界各 1 份。
- 新 `content/datacenter.json`(topic datacenter,registry 註冊):floor + 3 repeat 列 → **4 part 渲染成 12 台機櫃**。
- 驗證:12 台 3×4 出現、展開齊升、各台標籤(緯穎6669/廣達2382/鴻海2317);ai-server 無回歸;check/typecheck/lint/build 全綠。
- ⚠️ finding:展開時 12 台各顯示標籤 → 擁擠(spec 已知的 per-instance annotation 取捨,已 sign-off)。datacenter 公司/代號待查證。

## ③ 管線 / tube schema-change ✅(spec 03,人類已 sign-off)
- schema:`GeometryShape` 加 `tube`;`Geometry` 加 `path?`/`radius?`,`args` 改選用(向後相容)。
- `GeometryFactory`:加 `case 'tube'`,`useMemo` 建 `CatmullRomCurve3`(early return 前算,hook 安全)→ `<tubeGeometry args={[curve,32,r,12,false]}>`。**engine 只動 schema/GeometryFactory 兩處**。
- 不加單元 check(tube 是 three 視覺膠水,無純邏輯邊界,ADR-0010)。
- 新 `content/pipeline.json`(registry 註冊):2 儲槽(cylinder)+ U 形彎管(tube 4 點 CatmullRom)+ 直管(tube 2 點)+ 閥件。
- 驗證:彎管平滑圓管渲染、直管近直、展開整段管一起動、標籤(中鋼/官田鋼/大田);grid/box/cone 無回歸;全綠。
- ⚠️ finding:tube 標籤錨點走 halfW=1 else 分支,展開後 pipe-top 標籤離管身較遠、引線不貼(spec 已知取捨)。pipeline 公司/代號待查證。

## ④ 風機 / wind topic ✅(spec 04,純內容免 sign-off)
- 新 `content/wind.json`(registry 註冊):tower(cylinder 微錐)+ nacelle(box)+ hub(cone rot x+90° 朝前)+ 3 葉片(box,繞 z 0/120/240°)。
- 首次用 `transform.rotation` 擺零件(葉片 Y 字、錐鼻錐向前)。**engine 一行未改**(git diff 為空)。
- 驗證:風機渲染(3 葉成 Y)、展開各環節分離、標籤(世紀鋼/上緯/永冠);其他題目無回歸;typecheck/lint/build 全綠。
- ⚠️ finding:展開後風機比收合高,頂部葉片+標籤略出框(相機框景 nit)。公司/代號待查證。

## ⑤ 飛機 / kind:"model" GLB 載入 ✅(spec 05,人類已 sign-off + 授權確認)
- 素材:Airplane by Poly by Google(poly.pizza),**CC-BY** → 必須標註。GLB 移到 `public/models/airplane.glb`。
- schema:`ModelRef` 加 `attribution?`;`Transform` 加 `scale?`(借來模型常需縮放,spec 05 內處理)。
- 新 `engine/ModelPart.tsx`:drei `useGLTF` 載入,`<primitive>` 整隻渲染、沿用自帶材質;`Scene` 加 `<Suspense>`。
  `GeometryFactory`:`kind==='model'` 分支(early-return 前處理,因 model 無 geometry);group 加 `scale`。
- **engine 動 schema/ModelPart(新)/GeometryFactory/Scene 四處**(git diff 確認)。不加 check(視覺,ADR-0010)。
- 新 `ui/Credits.tsx`(App+Gallery 掛載):顯示 model.attribution。新 `content/aerospace.json`(registry 註冊)。
- 坑:GLB 原尺寸 ~562u 超巨 → 加 `transform.scale: 0.006` + 位移置中才可見。
- 驗證:飛機載入渲染(保留 cyan 自帶材質)、點選+標籤、展開**整隻一件不拆**、CC-BY 標註上畫面;5 題目無回歸;全綠無 pageerror。
- ⚠️ MVP:model 選取無 emissive 高亮(靠標籤);castShadow 未設(YAGNI)。漢翔 2634 待查證。

---
## 階段二 backlog 全數完成 🎉(① grid ② datacenter ③ pipeline ④ wind ⑤ aerospace)
6 題目;引擎驗證過 box/cylinder/cone/tube + repeat + rotation + model(GLB) 全形態。engine/content 分離全程守住。

## 公司資料移到 CSV ✅(ADR-0011,使用者要求)
- 公司↔元件對應從硬寫 JSON 抽到 `src/content/companies.csv`(edge list `topic,part,ticker,name`,**多對多**)。
- 6 個 JSON 的 annotation 只剩 title(migration 腳本一次抽出 21 列 + strip,跑完刪腳本)。
- 新 `parse-links.ts`(純解析,node 可測)+ `companies.ts`(Vite `?raw` 載入)+ `registry.getTopic` 載入時 join。**engine/schema 不動**。
- `tools/check-companies.ts`(`pnpm check`):驗多對多(一元件多公司、一公司多元件)、跳標題列、無對應回空。
- 驗證:截圖確認公司標籤照舊顯示(GPU 盤→NVDA+2330),全綠。
- 取捨:CSV 欄位不可含逗號(手刻 parser 無依賴);公司名每列重複(edge list),要強制一致再 normalize。

## 題目切換器 UI ✅(使用者要求)
- 新 `ui/TopicSwitcher.tsx`:左側清單,標題沿用各題目 `content.title`(免另維護)。App 掛載(Gallery 不掛,截圖乾淨)。
- 切換用 `<a href="?topic=X">` 整頁導航(非 SPA state)——刻意:相機 per-topic 只在 mount 套用,重載最省事且 URL 可分享。
- `registry` 加 `TOPIC_LIST` 匯出。engine 不動。
- 驗證:6 題目列出、點「風力發電機」→ URL 變 ?topic=wind、風機渲染、該項高亮,無 pageerror。
- 取捨:切換是整頁重載(lang/leva 狀態 reset);要無重載切換需改成 state + key remount,屬未來。

## 公司資料補齊多家(使用者回饋)✅
- 診斷:**非邏輯問題**——join(companiesFor)本就回傳該 part 所有公司、Annotation 全部渲染(gpu-01 早就顯示 2 家)。只一家是因為 CSV 當初每元件只放一筆占位。
- 修法:`companies.csv` 每個有標註元件補到 2~3 家實際公司(many-to-many),修掉錯的 valve(大田8924→亞德客1590)。台積電/NVDA 等跨多元件。
- `check-companies.ts` 改成**驗機制不綁資料**(有元件對多家、有公司跨多元件、完整性、跳標題、未知回空)→ 之後改 CSV 不會弄壞 check。
- 截圖確認每個盤都顯示多家公司。仍 AI 起草、**待人工查證**。已存記憶避免再犯(single placeholder)。

## 公司代號查證 ✅(使用者要求)
- 用 WebSearch + 權威「臺灣上市證券代號一覽表」交叉比對:**28 個代號全部正確**。
- 查證時發現對應產業不符:`上銀 2049`(線性傳動)放在變壓器鐵芯/閥件不對 → 鐵芯改 `大亞 1609`(變壓器漆包線)、閥件留 `亞德客-KY 1590`;名稱 `永冠`→`永冠-KY`。
- 代號正確 ≠ 對應一定合理;個別對應仍 AI 起草。

## config bake ✅
- leva 調好的值 bake 進 `DEFAULT_CONFIG`:labelDistance 1.95 / labelOpacity 0.5 / ambient 1.05 / hemisphere 0.45 / directional 1.3 / metalness 0.35 / roughness 0.35(float 雜訊清乾淨)。leva 面板保留(DEV-only)。

## 研究命令 + flow 運動 + 半導體題目 ✅(使用者要求)
- 新命令 `/research-supply-chain <產業>`:WebSearch 查證供應鏈實際運作,產出 `docs/supply-chains/<slug>.md`(環節/流動/公司/模型化建議)。已示範產出 `semiconductor.md`(6 環節、~25 家台股、代號查證)。
- spec 06 flow(sign-off 後實作):schema `shape:"flow"` + count/speed;新 `engine/FlowParticles.tsx`(useFrame 沿閉合 CatmullRom 循環);GeometryFactory case;materials 加 accent 色。engine 動 schema/FlowParticles(新)/GeometryFactory/materials。
- 依研究建 `semiconductor` topic:輸送帶 + 6 機台(box/cylinder)+ wafer-flow(12 顆藍球沿產線循環)。companies.csv 加 6 節點多公司。
- 驗證:截兩張 hash 不同 → 晶圓確實在動(ADR-0012 非決定性正向測試);展開顯示 6 節點 + 各自公司;build/check 全綠;pipeline 無回歸。
- ⚠️ 6 節點橫排 + 半透明標籤 → 展開時標籤略重疊(密集橫排的取捨);內容公司對應仍可校。

## 供應鏈三段管線 + 物件抽象 skill ✅(使用者要求,ADR-0013)
- `/design-demo <slug>`(新命令):接研究功課做設計取捨(精選節點/形狀/大小/布局/互動/物流)→ `specs/`。示範產出 `specs/07-topic-semiconductor.md`。
- skill `object-abstraction`(新):真實物件 → 可辨識的 primitive 組合。**判準=供應鏈意義**:鏈上有對應的部位就建(不論大小),只略過無供應鏈意義的造型細節(紋理/油漆/椅墊/通用五金);螺絲看角色。模型細節層次=供應鏈結構層次。
- 兩 skill 分工:object-abstraction(設計 WHAT)/ r3f-industrial-component(實作 HOW)。
- 三段管線:research(事實)→ design-demo(取捨,套 skill)→ add-topic(實作),各段可審查。
- 修正歷程:先誤寫「3~8 個 primitive」上限 → 使用者糾正「越詳細越好」→ 再澄清「判準是供應鏈意義非數量/擬真」→ 定案。

## semiconductor 重做細 + 名牌/放射拆解 ✅(spec 08 / ADR-0014)
- 套 object-abstraction 把 semiconductor 6 節點從單方塊 → primitive 組合(~8→29 parts;光罩/EFEM/製程腔/機台陣列/載板…)。
- **全域放射拆解**:explodeOffset 改自動「從 camera.target 往外+上抬」,所有題目共用;explode.vector 廢棄、只用 magnitude。ai-server 無回歸(中心盤仍垂直扇開)。
- **名牌系統**:Part 加 label/partOf;NameTag(小字);點選→名牌+節點卡(自己或 partOf 父卡),展開→節點卡;「名稱」按鈕 showAllNames。
- **每個元件都有名字**:結構件給 label,形狀小塊給 partOf 繼承父名+父卡(不必逐顆命名)。6 題目補齊。
- 驗證:點 fin-1(只 partOf)→ 繼承「散熱器」名+卡;點光罩→名+IC設計卡;放射散開;全綠無 pageerror。

## 公司卡微調 + Playbook ✅
- 公司卡:移除引線、錨點改元件中心(展開時跟大元件移到中心);公司 chips 改 flex-wrap + maxWidth 12em(超寬換行,不再排成寬一條)。
- 新 `docs/plan/topic-playbook.md`:供應鏈題目「建置/驗收」指南(三段管線 + 慣例速查 + **最終驗收清單** + 常見坑)。給使用者之後一條條更新其他供應鏈用。CLAUDE 指向它。
- 註:`labelDistance` config 旋鈕已無作用(卡片不再用偏移),留著無妨。

## 互動強化 + semiconductor 深度重做 ✅(使用者連續要求)
- **股票按鈕**:`showAllCards` toggle,不必展開即顯示所有公司卡(對稱「名稱」)。修點選自冒卡 → 公司卡只由「股票」/展開控制,點選只高亮+名牌。
- **透視/X-Ray(ADR-0015)**:`Part.enclosure` 旗標 + 全域 `xray` toggle;外殼半透明(opacity 0.12)+ 關 raycast(點穿)+ 關投影。材質用 `key` 重建避開 three「改 transparent 要 needsUpdate」坑。grid 油箱、semiconductor 代工外殼示範。
- **/research-supply-chain 深化**:命令改寫逼深度(每環節 8 欄、公司具體供應/市占;+TL;DR/產業地圖/競爭格局/趨勢風險/名詞表)。重跑 `docs/supply-chains/semiconductor.md` 為 web 查證深度版(36 公司、代號全查;修達興材料=5234)。
- **semiconductor v2 重建(spec 09)**:診斷實機 6 問題 → 修:flow 單向(回程藏帶下)、設備移側站(側向注入)、晶圓藍→晶片綠分色(materials 加 chip)、代工 enclosure 透視看內部、站距拉寬。
- **companies.csv → 41 列**:依研究 §5 補齊(設計8/矽晶圓5/設備8/代工4/封測12/下游4),代號查證;part id 不變,engine/JSON 不動。
- **截圖驅動接口**:`DevHandle`(DEV、Canvas 內)暴露 `window.__view`(camera/controls/scene/store),延伸 ADR-0008 補上相機角度/縮放;App+Gallery 都掛。**鍵盤快捷** `Hotkeys`(E/X/數字)。
- **flow 動線三層修法**:① path 改波浪「爬進每一站」(content);② **dwell 站點停頓**(spec 10,擴充 ADR-0012):schema +stops/dwell、`flow-dwell.ts` 純函式 `flowParam`(停點鎖 t)、`check-flow-dwell.ts`。實測粒子代工 1.3/封測 1.0 各鎖 ~0.5-0.6s。
- 驗證全程用 hotkey + `__view` 多角度截圖;typecheck/lint/build/check 全綠,無 pageerror。
- ⚠️ 殘留(可後續):展開時設備/封測公司卡在中央略重疊(封測 12 家卡偏高);supply-flow 白球偏小。

## process layer 產線語意修正 ✅(spec 11 / ADR-0016)
- 問題:實機半導體畫面仍像「小球閉合跑馬燈」,不像單向產線;flow 缺 station/route/token 語意。
- schema 加 optional `process`(`stations/routes/tokens`);新 `ProcessLayer.tsx` 畫單向 route tube + arrow + station marker + token。
- 新 `process-motion.ts` 純函式處理 route 移動與 station `processTime` 停留;`tools/check-process.ts` 串進 `pnpm check`。
- `semiconductor.json` 移除舊 wafer/chip/supply flow parts,改成 wafer-route/chip-route/supply-route:晶圓→代工→封測、晶片→下游、設備/材料側向注入。
- 更新 `/design-demo`、`/add-topic`、`/verify`、topic playbook:產線/物流題目優先用 process;`flow` 只保留裝飾性/非語意循環流動。
- 驗證:`pnpm check`、`pnpm typecheck`、`pnpm lint`、`pnpm build` 全綠;截圖 `semicon-process.png` 可見單向箭頭與少量物料 token 穿站心。

## 單台機台三段管線 ✅
- 問題:供應鏈有 research → design → add-topic,但單台機台仍容易直接堆 primitive,品質不穩。
- 新增 `/research-machine` 與 `/design-machine`;新增 `docs/machines/README.md`。
- `/add-component` 改成先讀 machine research/spec,再實作到 `content/*.json`;第一台機台不先抽 `engine/kit/`。
- 同步 `CLAUDE.md`、`PLAN.md`、`topic-playbook.md`、`machine-patterns.md`、`specs/_TEMPLATE.md`。
- 驗證:文件路徑 `git diff --check` 通過;未跑 build(純文件/command 變更)。
