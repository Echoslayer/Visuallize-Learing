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

## 重電 / 電網 redo Phase D — Topic-level 電力流接線 ✅
- 在 `src/content/grid.json` 新增 topic-level `process`: `hv-route`(accent) 高壓進線 → GIS → transformer; `lv-route`(chip) transformer → busbar → distribution → load; `control-route`(metal-light) control → GIS/transformer/distribution。
- 介面契約對齊:GIS `high-voltage-ac → protected-high-voltage-ac`;transformer `protected-high-voltage-ac → stepped-ac`;busbar `stepped-ac → load-power`;distribution `load-power → served-load`;control `status → trip-command`。
- 驗證:JSON parse、diff-check、`pnpm check`、typecheck、lint、build 全綠;截圖 `grid-phase-d.png`、`grid-phase-d-exploded.png`、`grid-phase-d-cards.png` 可讀。
- Ponytail 取捨:暫不新增 ADR / topic-playbook pattern;目前只是既有 `process` schema 的內容實例,等第二個「變電站式 power flow」題目出現再抽 pattern。
- 下一步:人類校對 companies.csv 的 grid 公司對應,或 commit grid redo 分批變更。

## 重電 / 電網 redo Phase C-4 — Distribution / Load ✅(待人類確認)
- 三段管線:`docs/machines/distribution-load.md`(研究)→ `specs/25-machine-distribution-load.md`(Rack/Panel pattern)→ `src/content/grid.json` 實作。
- 新增 `distribution` 主機台:配電櫃、盤面、電表/HMI、主斷路器、分路 breakers、出線端子、出線電纜、用電負載 rack。
- 機台級流:`load-power`(chip)進 → distribution-feed dwell 0.4s → `served-load`(chip)出;作為 grid demo 終端。
- companies.csv 先掛 `distribution`:士電、亞力、中興電、台達電;需人類查證。
- 驗證:JSON parse/diff-check/typecheck/lint/build 全綠;截圖 `grid-distribution-machine.png`、`grid-distribution-machine-names.png`、`grid-gallery-c4.png` 可讀。
- 下一步:人類確認截圖 → Phase D topic-level 電力流接線 + 全題驗收。

## 重電 / 電網 redo Phase C-3 — Control & Protection Panel ✅(待人類確認)
- 三段管線:`docs/machines/control-protection.md`(研究)→ `specs/24-machine-control-protection.md`(Rack pattern)→ `src/content/grid.json` 實作。
- 新增 `control` 主機台:控制櫃、盤面框、保護電驛模組(repeat)、SCADA/HMI 螢幕、單線圖、端子排、通訊處理器、控制電源/UPS。
- 機台級流:`field-status`(metal-light)進 → control-logic dwell 0.4s → `trip-command`(metal-light)出;不使用主電力顏色。
- companies.csv 先掛 `control`:中興電、亞力、台達電;需人類查證。
- 驗證:JSON parse/diff-check/typecheck/lint/build 全綠;截圖 `grid-control-machine.png`、`grid-control-machine-names.png`、`grid-gallery-c3.png` 可讀。
- 下一步:人類確認截圖 → Phase C-4 Distribution / Load。

## 重電 / 電網 redo Phase C-2 — Busbar / Cable ✅(待人類確認)
- 三段管線:`docs/machines/busbar-cable.md`(研究)→ `specs/23-machine-busbar-cable.md`(Piping Skid 變體)→ `src/content/grid.json` 實作。
- 新增 `busbar` 主機台:低矮框架、三相母線、兩排絕緣支柱、電纜終端、三條出線電纜、接地排。
- 機台級流:`stepped-ac`(chip)左進 → busbar-transfer dwell 0.2s → `load-power`(chip)右出;不做控制訊號。
- companies.csv 先掛 `busbar`:大亞、華新、中鋼;需人類查證。
- 驗證:JSON parse/diff-check/typecheck/lint/build 全綠;截圖 `grid-busbar-machine.png`、`grid-busbar-machine-names.png`、`grid-gallery-c2.png` 可讀。
- 下一步:人類確認截圖 → Phase C-3 Control & Protection Panel。

## 重電 / 電網 redo Phase C-1 — GIS / Breaker ✅(待人類確認)
- 三段管線:`docs/machines/gis-breaker.md`(研究)→ `specs/20-machine-gis-breaker.md`(Piping Skid + Process Tool pattern)→ `src/content/grid.json` 實作。
- 新增 `gis` 主機台:GIS tank(enclosure)、三相母線筒、斷路器腔、操作機構、隔離/接地開關、進出線套管、GIL 出線管、狀態監測、底座。
- 機台級流:高壓 AC(accent)左進 → breaker station dwell 0.5s → 高壓受保護輸出(accent)右出;控制訊號(metal-light)走 side route。
- companies.csv 先掛 `gis`:中興電、亞力、士電;需人類查證。
- 驗證:JSON parse/diff-check/typecheck/lint/build 全綠;截圖 `grid-gis-machine.png`、`grid-gis-machine-xray.png`、`grid-gallery-c1.png` 可讀。
- 下一步:人類確認截圖 → Phase C-2 Busbar / Cable。

## 重電 / 電網 redo Phase C-0 — Power Transformer ✅(待人類確認)
- 三段管線:`docs/machines/power-transformer.md`(研究)→ `specs/19-machine-power-transformer.md`(Transformer pattern)→ `src/content/grid.json` 實作。
- 舊 `grid` close-up 破壞式替換為單台油浸式電力變壓器:油箱(enclosure)、頂蓋/底座、三柱鐵芯、繞組、HV/LV 套管、散熱片、油枕、分接開關、保護監測附件。
- 機台級流:高壓 AC(accent)進 → core station dwell 0.8s → 低壓/step AC(chip)出;控制訊號(metal-light)走 side route,不混主電力流。
- companies.csv 舊 grid 公司先全部重指到 `transformer`;子部位公司對應仍需人類查證後再細分。
- 驗證:JSON parse/diff-check/typecheck/lint/build 全綠;截圖 `grid-transformer-machine.png`、`grid-transformer-machine-xray.png` 可讀,重複 label 已收斂。
- 下一步:人類確認截圖 → Phase C-1 GIS / Breaker。

## IC 設計機台 + 機台頁互動 + 公司卡解耦 ✅
- **IC 設計機台(spec 12)**:三段管線重建 design 節點 → 三螢幕 EDA 工作站 + floorplan/IP/PDK + signoff 板 + 運算機架(content,partOf 繼承)。
- **EDA accent 座標修正**:code/waveform/tick 三條原本浮空且未隨螢幕旋轉(斜插、看似在背面、很淡)→ 貼齊各螢幕正面(朝相機 +z 面)並對齊 rotation,改為像印在螢幕上。
- **機台頁支援拆解/名稱**:`Gallery.tsx` 掛上主場景同一組 `Controls`+`Hotkeys`(皆只接 `useSelection`、與題目無關),機台頁行為與供應鏈頁一致。
- **公司卡解耦展開**:`GeometryFactory` card 改 `showAllCards ?` only(原 `exploded || showAllCards`)→ 展開不再強制冒卡,「股票」鈕成為唯一開關(展開後也關得掉)。`exploded` 仍用於幾何放射,無 dead code。
- 驗證:typecheck/lint/build 全綠;截圖機台頁拆解+名稱、拆解無股票時無卡、EDA 條塊貼齊螢幕。

## 機台重做 Phase 0 — 機台級進出流機制 ✅(待人類確認 + ADR)
- 問題:機台頁(gallery 聚焦)`focusMachine` 直接 `process: undefined`,單機台沒物料進出。
- 機制(方案 A):schema 加 `Part.process?`(machine-local 座標,root 為原點)+ `ProcessSpec.scale?`(管/箭頭/環尺寸倍率,單機台 ~0.4);`focusMachine` 把 root part 的 process 提升為 `content.process`。
- `ProcessLayer`/`process-motion` 原樣重用,只加 `scale` 倍率(箭頭/torus/tube 半徑);整線視圖不帶 scale → 預設 1,無回歸。
- design 試金石:`design-in`(spec/白進)→ 站 design-wks(floorplan,dwell 0.6s)→ `design-out`(GDS/綠出);in/out 分色、單向、箭頭。
- 驗證:check/typecheck/lint/build 全綠;`phase0-design2.png` 機制成立。
- 待辦:人類確認機制 → 補 ADR(機台級 process + gallery 渲染 + scale)→ Phase 1 矽晶圓。

## 機台重做 Phase 1 — 矽晶圓 wafer ✅(待人類確認)
- 三段管線:`docs/machines/wafer.md`(研究,公司標需查證)→ `specs/13-machine-wafer.md`(設計,Crystal-Growth Cell pattern)→ 實作。
- 從「單晶棒圓柱+疊片+卡匣」重做為長晶爐單元:爐體(enclosure)、晶棒、坩堝、晶種桿、線鋸切片、晶圓疊(藍)、卡匣、CMP 拋光盤。
- 機台級流:`silicon`(灰)左進 → 站 wafer-grow(dwell 0.8s)→ `wafer`(藍/accent)右出;in/out 分色、單向、scale 0.4。
- 介面契約:output accent = 整線 wafer-route 材質 = foundry input(Phase 6 接線用)。
- 微調:右側 saw/stack/cassette/CMP 原本擠在同點 → 沿 z 散開(saw 前、stack+卡匣 中、CMP 後)。
- 驗證:check/typecheck/lint/build 全綠;`p1-wafer*.png`:剪影像長晶爐、透視見晶棒、流動單向分色、名稱齊。
- 下一步:Phase 2 晶圓代工 foundry。

## 機台重做 Phase 2 — 晶圓代工 foundry ✅(待人類確認)
- 三段管線:`docs/machines/foundry.md`(研究,公司需查證)→ `specs/14-machine-foundry.md`(Fab Cleanroom Bay pattern)→ 實作。
- 從「外殼+屋頂一排機台+軌道」重做為無塵室 bay:外殼(enclosure)內藏微影機+投影鏡頭+製程晶圓(卡盤)+蝕刻/沉積腔體(repeat×2)+CMP;頂部 AMHS 軌道+FOUP。
- 機台級流(3 路):藍空白晶圓(accent)左進 + 灰設備(metal-light)後側注入 → 站 foundry-proc(dwell 1.2s 最長)→ 綠已加工晶圓(chip)右出。
- ⚠️ 介面契約待決:機台頁在 foundry 即藍→綠,整線目前 osat 才變;Phase 6 決定變色點(已記 spec/研究/計畫)。
- 驗證:check/typecheck/lint/build 全綠;`p2-foundry*.png`:剪影像 bay+天車、透視見內部製程模組、3 路流單向分色、名稱齊。
- 下一步:Phase 3 設備/材料 equip。

## 機台重做 Phase 3 — 設備/材料 equip ✅(待人類確認)
- 三段管線:`docs/machines/equipment.md`(研究,公司需查證)→ `specs/15-machine-equipment.md`(Supply Hub pattern)→ 實作。
- 從「單一 cluster tool」補成設備+材料 hub:設備側保留 mainframe+EFEM+裝載埠+製程腔(改 repeat×2)+氣體管路;材料側新增氣體鋼瓶(×3)+化學品桶(×2)+光罩盒(藍)。
- 機台級流(源頭):深灰原料拉進 → 站 equip-dispense(dwell 0.4s)→ 亮灰 supply 往 fab 出;in/out 分色、單向、scale 0.4。
- 介面契約:output metal-light = 整線 supply-route 材質 = foundry 側向 input。
- 驗證:check/typecheck/lint/build 全綠;`p3-equip*.png`:設備+材料兩類可辨、supply 單向出、名稱齊。
- 小瑕疵(可後續):材料群略被 mainframe 遮、化學桶半藏;不影響辨識。
- 下一步:Phase 4 封裝測試 osat。

## 機台重做 Phase 4 — 封裝測試 osat ✅(待人類確認)
- 三段管線:`docs/machines/osat.md`(研究,公司需查證)→ `specs/16-machine-osat.md`(Assembly & Test Line pattern)→ 實作。
- 補成封裝段(切割/封裝載板/打線臂/封膠)+ 測試段(測試機/測試座×2/成品盤綠);保留 substrate/bonder/tester/sockets,新增 dicing/mold/tray。
- 機台級流:藍已加工晶圓(accent)左進 → 站 osat-pkg(dwell 0.9s)→ 綠成品晶片(chip)右出;整線藍→綠變色點即此(與 topic 一致)。
- 介面契約:input accent = foundry 對應;output chip = 整線 chip-route = downstream input。
- 驗證:check/typecheck/lint/build 全綠;`p4-osat*.png`:封裝+測試兩段可辨、藍→綠單向、名稱齊。
- 下一步:Phase 5 下游應用 downstream(最後一台)。

## AI 伺服器重做 Phase A — 供應鏈研究 ✅(待人類校對)
- `/research-supply-chain ai-server` → `docs/supply-chains/ai-server.md`(WebSearch 多源查證,2026-06)。
- 9 環節:GPU/加速器、HBM、CPU、NVLink/NVSwitch、網路+光收發、電源、液冷、ABF載板/PCB/連接、系統 ODM。
- ~35 家公司(台股為主+國際),代號交叉比對:ODM(鴻海2317/廣達2382/緯創3231/緯穎6669/英業達2356/技嘉2376)、散熱(奇鋐3017/雙鴻3324)、電源(台達2308/光寶2301)、載板(欣興3037/南電8046/景碩3189)、PCB/CCL(金像電2368/健鼎3044/台光電2383)、連接(嘉澤3533/貿聯3665)、網路(智邦2345)、製造封裝(台積2330/日月光3711);國際 NVDA/AMD/SK Hynix/Micron/Broadcom/Amphenol。
- 關鍵卡脖子:CoWoS(TSMC)、HBM(SK Hynix ~90% 供 NVIDIA)、ABF 載板。
- 重點洞察:這是**機櫃互連**(電源發散層 + 資料 fabric 雙向),非輸送帶單向產線 → 影響整機 process 設計。
- 待人類校對:市占/出貨數字會變動、公司↔盤多對多歸類、國際代號是否納入 demo。
- 下一步:Phase B `/design-demo ai-server`。

## AI 伺服器重做 Phase B — design demo ✅(待人類拍板)
- `/design-demo ai-server` → `specs/17-topic-ai-server.md`(讀研究 + machine-patterns,套 object-abstraction)。
- 精選 7 節點:GPU 運算盤×2、CPU 運算盤、NVSwitch 交換盤、網路交換盤、電源盤、機櫃/系統(rack框+CDU+ODM)。HBM/CoWoS/載板=GPU 盤子部位+掛公司,非獨立盤。
- 布局:直立 Rack,盤由上而下堆疊;相機斜前看正面+側面。每盤=PCB slab + 晶片 + 散熱 + 連接器(partOf)。
- 互連(關鍵決策,建議採用):整機兩層 topic-process —— 電源層(電源盤→busbar 上行發散)+ 資料層(GPU→NVSwitch→網路,單向匯入交換);非閉環。機台級流 reuse Part.process+scale0.4。
- 待人類拍板(§7):①國際代號是否納入 csv(建議納入 NVDA/SK Hynix/Broadcom…)②節點數 7 OK ③整機兩層方案 ④GPU 盤數 2 片 ⑤CDU 獨立與否。
- 下一步:人類拍板 → Phase C-0 GPU 運算盤試金石。

## AI 伺服器重做 Phase C-0 — GPU 運算盤試金石 ✅(待人類確認)
- 採 Phase B §7 建議預設(國際代號納入/7節點/兩層互連/2 GPU盤/CDU 子部位)續做。
- `tray-gpu-01` 從單方塊 → 複合盤:薄盤底 + 綠 PCB + GPU 模組×2 + HBM×6 + 冷板×2(藍)+ NVLink 連接器×9 + VRM(皆 partOf)。
- **新增 material `heat`(橘 #f97316)**——materials.ts 登錄(非 schema 變更),供散熱 token。
- 機台級流(reuse Part.process,**scale 0.6**,因盤比半導體機台大):資料 in→out(藍)+ 電源 in(銀,side)+ 廢熱 out(橘,上)；單向、過站、分色。
- 驗證:check/typecheck/lint/build 全綠;gallery `c0-gpu*.png` 剪影像 GPU 盤+散熱橘箭頭;topic `c0-rack.png` 盤在機櫃中、未壞(其餘 5 盤仍占位白板待 C-1..C-5)。
- 試金石確立配方:複合盤 + 機台流 scale 0.6 + heat 材質。
- 下一步:Phase C-1 GPU 運算盤 #2(套同配方)。

## AI 伺服器重做 Phase C-1 — GPU 運算盤 #2 ✅(待人類確認)
- `tray-gpu-02` 套 C-0 同配方,y 下移 0.4(anchor 2.2);複合盤 + 機台流(scale 0.6,資料/電源/熱)identical 到 #1。
- 驗證:check/typecheck/lint/build 全綠;`c1-gpu2.png` 與 #1 一致、流動正常。
- 下一步:Phase C-2 CPU 運算盤(新設計:socket + DIMM)。

## AI 伺服器重做 Phase C-2 — CPU 運算盤 ✅(待人類確認)
- `specs/21-machine-cpu-tray.md`(design-machine,引研究 §3③ + topic spec 17)→ 實作。
- `tray-cpu` 從單方塊 → 複合盤:綠 PCB + CPU socket×2 + 散熱器×2 + DIMM 記憶體立條×8(招牌)+ VRM。
- 機台級流(scale 0.6):資料 in→out(藍)+ 電源 in(銀);無熱(CPU 較少,與 GPU 盤的橘熱羽區隔)。
- 驗證:check/typecheck/lint/build 全綠;`c2-cpu-n.png` DIMM 立條陣列辨識度高、與 GPU 盤明顯不同、流動正常。
- 下一步:Phase C-3 NVSwitch 交換盤。

## 機房 / datacenter redo ✅(spec 18)
- 依 redo plan 把 `datacenter` 從早期 repeat 範例重做為資料中心基礎設施 demo。
- 新增/同步文件:`docs/plan/datacenter-redo.md`、`docs/supply-chains/datacenter.md`、`specs/18-topic-datacenter.md`。
- `src/content/datacenter.json`:五個 root 節點——運算機櫃列、電力室/UPS PDU、液冷/空調迴路、網路交換 fabric、監控/DCIM;子部位用 `partOf`,外殼用 `enclosure`,機櫃列/托盤/狀態燈用 `repeat`。
- topic-level `process`:power-feed(accent)、cooling-supply(chip)、cooling-return(heat)、data up/down(metal-light)、telemetry(metal-light),不新增 engine/schema。
- `companies.csv` 重指 datacenter root nodes(代表公司需人類校對)。
- 驗證:check/typecheck/lint/build 全綠;截圖 `datacenter.png`、`datacenter-xray.png`、`regress-aiserver.png` 讀回 OK。一般狀態像機房;X-Ray/名稱可見機櫃托盤與電力/冷卻/資料/監控路徑。X-Ray 名牌略密,不值得為此改 engine。

## AI 伺服器重做 Phase C-3 — NVSwitch 交換盤 ✅(待人類確認)
- `specs/22-machine-nvswitch-tray.md`(原編 19,因與並行新增的 datacenter/grid/transformer specs 撞號 → 重編 21/22)→ 實作。
- `tray-nvswitch` 從單方塊 → 複合盤:綠 PCB + 中央 NVSwitch ASIC + 藍散熱蓋 + 高密度連接器×10 + NVLink 銅纜束(藍 tube×5,arcing 往背板)。
- 機台級流(scale 0.6):switch fabric 多路藍資料 in(左+前)→ 交換 → 多路 out(右+後);全 accent、單向、過站。
- 命名撞號處理:本輪 ai-server 機台 spec 18/19 與並行作業撞號 → 改 21(cpu)/22(nvswitch);plan/log 已更正。
- 驗證:check/typecheck/lint/build 全綠;`c3-nvsw-n.png` 中央大 ASIC+銅纜束辨識清楚、多路流動正常。
- 下一步:Phase C-4 網路交換盤。

## AI 伺服器重做 Phase C-4 — 網路交換盤 ✅(待人類確認)
- `specs/23-machine-network-tray.md` → 實作。
- `tray-network` 從單方塊 → 複合盤:綠 PCB + 交換 ASIC + 散熱器 + 光模組籠×12(招牌,前緣一排)。
- 機台級流(scale 0.6):封包 in(左)→ 交換 → out(右)+ 光模組側出 + 電源 in;單向、分色、過站。
- 驗證:check/typecheck/lint/build 全綠;`c4-net-n.png` 光模組陣列辨識清楚、流動正常。
- 下一步:Phase C-5 電源盤(最後一盤)。

## AI 伺服器重做 Phase C-5 — 電源盤 ✅(待人類確認)
- `specs/24-machine-power-tray.md` → 實作。
- `tray-power` 從單方塊 → 複合盤:PSU 電源模組×5 + 藍 DC 匯流排(busbar)+ BBU 電池備援。
- 機台級流(scale 0.6):AC(深灰)進 → 整流 → DC(亮灰)出 + 上行;單向、分色(AC→DC)、過站。
- 驗證:check/typecheck/lint/build 全綠;`c5-pwr-n.png` PSU 排+藍 busbar 辨識清楚。
- **6 盤(C-0..C-5)全部重做完**;下一步 Phase D 整機互連 + rack-sys/CDU 節點 + companies.csv。

## AI 伺服器重做 Phase D — 整機互連 + 全機驗收 ✅(待人類校對公司)
- **rack-sys 節點**:rack-back→rack-sys(機櫃/系統,annotation),partOf 子部位:底座 + NVLink 背板(藍)+ CDU + 冷卻歧管(tube)。
- **整機兩層 topic process**:電源層(power-route,銀,電源盤→右側上行發散)+ 資料層(data-route,藍,GPU→NVSwitch→網路,左側單向);station 錨 tray-power/tray-nvswitch;非閉環。
- **companies.csv 充實**:7 節點多對多(GPU 加 SK海力士/美光/欣興/奇鋐;NVSwitch 加 Amphenol/嘉澤/貿聯;網路加 Marvell/Innolight;rack-sys 加 ODM 鴻海/廣達/緯創/緯穎/英業達+散熱);**含國際代號;準確性待人類校對**。
- **ADR-0017**:機台級 process(Part.process machine-local + ProcessSpec.scale)正式記錄(semiconductor Phase 0 延後的決策,已跨兩題目驗證)。
- 驗證:check(companies/flow-dwell/process 全 ok)/typecheck/lint/build 全綠;`d-rack.png` 背板+電源/資料雙層流、`d-gpu-cards.png` GPU 卡顯示 7 公司(含 SK海力士/美光)、rack-sys 入 nav。
- 已知限制:rack-sys(機櫃框 3.2 高)gallery 聚焦相機過近,構圖偏滿(ADR-0017 記;非阻塞)。
- **AI 伺服器重做計畫 A→D 全部完成**。剩:人類校對公司、/update-docs、/commit。

## 機台重做 Phase 5 — 下游應用 downstream ✅(待人類確認)
- `docs/machines/downstream.md` + `specs/26-machine-downstream.md` → 實作。
- 從「單一伺服器機櫃」重做為終端市場 showcase:市場平台 + 伺服器(4 盤)+ 智慧手機 + 筆電(底+螢幕)+ 車用電子(車身+座艙+輪)。
- 機台級流(scale 0.4):綠晶片(chip)進 → 整合站(dwell 0.6s)→ 亮灰終端(system/metal-light)出;單向、分色、過站。
- 驗證:check/typecheck/lint/build 全綠;`p5-ds-n.png` 多終端可辨、綠→灰流動正常(名稱視圖標籤略擠,實景清楚)。
- **semiconductor 6 台機台(design/wafer/foundry/equip/osat/downstream)全部重做完**;剩 Phase 6 整線接線(材質介面契約對齊:foundry 變色點)。

## 機台重做 Phase 6 — 半導體整線接線 + 全線驗收 ✅
- **介面契約對齊**:foundry 機台頁 output chip(綠)→ 改 accent(藍)。定論:整線藍→綠變色點在 **osat**(已加工晶圓仍是晶圓=藍;封測切割封裝後才成晶片=綠)。同步 spec 14 + foundry 研究 doc 的待決註記 → 已決。
- **整線驗收**(`p6-line.png`):單向;wafer→foundry→osat 全藍、osat→downstream 綠;設備/材料側向注入;downstream 多終端 showcase 收尾。foundry 機台頁(`p6-foundry.png`)in/out 皆藍,與整線一致。
- 導航(機台 link / ← 供應鏈)沿用既有,正常。
- 無新 ADR(Phase 6 僅契約材質對齊,易反轉;機台級 process 機制已記 ADR-0017)。Pattern 不另寫 playbook(避免與並行作業衝突;ADR-0017 + specs 已涵蓋)。
- 驗證:check/typecheck/lint/build 全綠。
- **半導體機台重做計畫(Phase 0–6)全部完成。**

## /update-docs — 同步 ai-server + semiconductor 重做完成 ✅
- CLAUDE.md §現在該做什麼:ai-server C-4 行 → A–D 完成;新增 semiconductor 機台重做(Phase 0–6)行;下一步改為校對 companies(含 semiconductor)。
- README.md:ai-server 改「6 盤 + rack-sys + 雙層互連」;semiconductor 改「6 台深做 + 整線藍→綠」;已知待辦補 semiconductor。
- topic-playbook.md:可重用 pattern 加「機台級物料流(ADR-0017,Part.process machine-local + scale)」。
- 無新 ADR(ADR-0017 已涵蓋機台級 process;Phase 6 僅契約材質對齊,易反轉)。
- ⚠️ 多 agent:CLAUDE/README/topic-playbook 同時被並行作業(grid/datacenter/pipeline)編輯;本次只動 ai-server/semiconductor 相關行,保留其餘。
