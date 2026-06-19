# 0018 — docs 結構對應三段管線(研究→設計→實作)

Status: Accepted

## Context

文件曾散在 8 處、橫跨兩棵樹:設計規格 `specs/` 在 repo 根,其餘在 `docs/`;研究被切成 `docs/supply-chains/`(題目級)與 `docs/machines/`(機台級)兩個目錄;`docs/plan/` 同時塞了正典(CONTEXT/PLAN/SETUP/playbook)與各題目「這次重做」的進度日誌(`*-redo.md`);還有拼錯的 `docs/reveiw/` 與根目錄空的 `assest/`。

沒有任何索引說明「研究放哪、spec 放哪、決策放哪」,跨 agent 接手時要靠猜,定位成本高。這跟 CLAUDE.md 已宣告的三段管線(研究 → 設計 → 實作)概念對不上。

## Decision

文件樹**對應已存在的三段管線**,並收斂成單一棵樹(全在 `docs/` 下):

- `docs/CONTEXT.md` `PLAN.md` `SETUP.md` `topic-playbook.md` `machine-patterns.md` —— 正典,提到 `docs/` 根。
- `docs/research/supply-chains/` + `docs/research/machines/` —— **① 研究**,兩種粒度同一個家。
- `docs/specs/` —— **② 設計**(從 repo 根 `specs/` 收進來)。
- `docs/progress/*-redo.md` —— **③ 實作**進度日誌(從 `plan/` 拆出)。
- `docs/adr/`(決策)、`docs/review/`(一次性審查報告,原拼錯的 `reveiw/`)、`docs/assets/`、`docs/references/`。
- 新增 **`docs/README.md` 地圖**:一張表把「你要找 X → 去哪」講清楚;CLAUDE.md 開頭指向它。

搬遷一律 `git mv` 保留歷史;所有引用(CLAUDE/README/`.claude` commands+skills/docs prose 路徑 + 相對連結)同步更新,並用一次性 link-checker 驗證 0 斷鏈。`.agent/` 的歷史 log 不改(裡面的舊路徑是當時事實)。

## Consequences

- 找文件先看 `docs/README.md`;目錄名即管線階段,新 agent 不必重建脈絡。
- 純文件搬遷,`src/`/`tools/` 不引用 docs 路徑 → 不影響 build。
- 慣例:**新研究進 `research/`、新 spec 進 `specs/`、重做日誌進 `progress/`**;別再把進度塞回正典或在 repo 根開新文件目錄。
- 既有 slash command 產物路徑(`/research-*`→`research/`、`/design-*`→`specs/`)已同步更新。
- 已知限制:`docs/specs/` 有重號檔(18/23/24 各兩份),屬先前並行新增的歷史殘留,非本次結構問題,維持原檔名不動。
