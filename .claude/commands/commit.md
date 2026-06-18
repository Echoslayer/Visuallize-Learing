# Commit
> 建立一個格式正確的 git commit。先確認 `/verify` 全綠才 commit（PLAN.md §2.7）。
> （借鏡 TAC `/commit`。）

## Instructions
- 訊息格式：
  - 階段一查核點：`C{n}: <描述>`（如 `C3: add part selection + highlight`）。
  - 階段二工作單元：`<type>: <描述> (spec: <spec 檔名>)`，type ∈ `feat|fix|chore|refactor`。
- 描述用現在式、簡潔、≤50 字、句末不加句號。
- 一次只 commit 一個工作單元，不混多個元件/題目。
- 結尾加一行：`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`。

## Run
1. `git diff HEAD` 了解變更。
2. `git add -A`。
3. `git commit -m "<訊息>"`。

## Report
- 回傳使用的 commit 訊息。
