# Update Docs
> 完成一個查核點/工作單元、或做了值得記的決策後,把「活文件」與 ADR 同步到現狀。
> 原則:CONTEXT.md / PLAN.md 是正典(少動);活文件(README/CLAUDE/log)指向它們,不複製內容。

## Variables
scope: $1 — 這次同步的對象(如 "C5"、"add transformer");省略則用最近一次 commit / 未提交變更推斷。

## Run

1. **確認改了什麼**:`git diff HEAD --stat` 或 `git log --oneline -3`;對照 `scope`。

2. **更新進度標記**(只改與現狀不符處,保持精簡):
   - `README.md` §狀態:完成到哪、下一步是什麼。
   - `CLAUDE.md`:§專案結構(`已建`/`之後` 檔案清單)、§現在該做什麼(進度行 + 下一步)。
   - `.agent/log.md`:新增該查核點/單元的一段 ✅ 摘要(做了什麼、怎麼驗的、待辦)。

3. **判斷要不要新增 ADR**(`docs/adr/`):
   - **要**:當這次做了**重要且不易回頭**的決策——選了某方案而捨棄替代、定下跨檔約束、
     或刻意偏離既有計劃(如版本、依賴、架構邊界、測試縫)。
   - **不要**:純照計劃實作、bug 修正、換色調文案、可輕易反轉的細節 → 跳過,別灌水。
   - 新增方式:`docs/adr/NNNN-<slug>.md`(Nygard 格式:Status/Context/Decision/Consequences,
     繁中),並在 `docs/adr/README.md` 索引加一列。
   - **ADR 不可改寫**(歷史不可變)。要推翻舊決策 → 新增一則標 `Supersedes NNNN`,
     在舊則標 `Superseded by MMMM`,不要編輯舊內容。

4. **一致性檢查**:確認三份活文件對「目前到哪、下一步」說法一致;路徑/檔名與實際相符。

## Guardrails
- 不把 CONTEXT/PLAN 的內容複製進活文件——用連結指過去。
- 不為了「有更新」而硬寫 ADR;沒有重大決策就明說「無新 ADR」。
- 題目字眼仍只進 `content/*.json`,文件範例勿讓 engine 沾上題目語意。

## Report
- 條列改了哪些檔、有無新增 ADR(編號+標題,或「無」)。
- 末尾提醒:要不要 `/commit`。
