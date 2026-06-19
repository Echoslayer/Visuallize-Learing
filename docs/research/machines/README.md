# Machine Research

這裡放「單台機台」的研究文件。它介於供應鏈研究與 content 實作之間，避免每次做機台都直接憑感覺堆 primitive。

最小流程：

1. `/research-machine <machine>` → `docs/research/machines/<slug>.md`
2. `/design-machine <slug>` → `docs/specs/<NN>-machine-<slug>.md`
3. `/add-component <slug>` → 依 spec 修改 `src/content/*.json`

規則：

- 研究寫事實：用途、外觀、輸入輸出、關鍵子系統、來源。
- 設計寫取捨：套哪個 `docs/machine-patterns.md` pattern、哪些部位要 primitive 化。
- 實作先落在 content JSON。`src/engine/kit/` 只在同一拼法跨 2+ 題目重複且 JSON 難維護時再抽。
- 不把公司、產業名、題目字眼寫進 `src/engine/`。
