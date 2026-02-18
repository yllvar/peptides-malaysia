---
description: The V2 "Integrity Loop" protocol for functional and contextual development.
---

# The Integrity Loop (Workflow V2)

**The Integrity Loop** is the standard operating procedure for all development on **Peptides Malaysia - Evo™**. It replaces the previous "Golden Workflow" by prioritizing functional correctness and context preservation over purely aesthetic iterations.

## 🔄 Core Philosophy

> **"Make it work, keep it working, then make it beautiful."**

1.  **Context First:** Never start coding without understanding the *current* state (File System + Knowledge Items).
2.  **Functional Integrity:** A feature is not done until it works *and* tests pass.
3.  **Shared Knowledge:** Documentation is not an afterthought; it is the bridge between sessions.

## 🛠️ The Loop Steps

### 1. 🔍 Context Loading (The "Read" Phase)
**Before a single line of code is written:**
- **Check KIs:** strict review of `knowledge/` summaries.
- **Check Status:** Run `verify_db.cjs` or `npm run test` to confirm the baseline is green.
- **Review Plan:** detailed read of `roadmap/` or current task artifacts.

### 2. 🧱 Implementation (The "Write" Phase)
- **Small Batches:** changes should be atomic and verifiable.
- **Test-Driven:** If a bug is fixed, a test case should verify it.
- **Log Gaps:** if you see a missing doc or a potential issue, log it (don't ignore strict warnings).

### 3. 🧪 Verification (The "Proof" Phase)
- **Run Tests:** `npm run test` is mandatory before finishing a task.
- **Manual Check:** Verify the fix works in the dev environment (`npm run dev`).
- **Audit:** Ensure no "premium" styling broke the layout structure (Mobile responsiveness check).

### 4. 📝 Documentation (The "Save" Phase)
- **Update Artifacts:** specific technical details go into `docs/`.
- **Update Knowledge:** generalized patterns go into KIs.
- **Summary:** End the session with a clear "State of the World" summary.

## 🚨 Anti-Patterns (What to Avoid)
- **"Blind Styling":** Applying tailwind classes without checking if the component renders logic correctly.
- **"Assume it works":** Skipping local validation because the code "looks right".
- **"Documentation Debt":** Leaving the documentation update for "later" (it never happens).
