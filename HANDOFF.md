# HANDOFF — react-native-hush

**Generated:** 2026-07-21
**Reason:** 76-fun Thelio to System76 for NVMe repair; work continues elsewhere.
**Repo path on origin machine:** /home/paul/go/src/github.com/EdgeApp/react-native-hush
**Remote:**
- `origin` → https://github.com/PaulSnow/DXC--react-native-hush.git (fetch/push)
- `upstream` → https://github.com/EdgeApp/react-native-zcash (fetch/push)

Note that `upstream` is the **Zcash** library — this repo is a rename-fork of it.

## 1. What this repo is

A React Native native-module library that wraps a Zcash light-client SDK
(`ZcashLightClientKit` on iOS, the Zcash Android SDK on Android) and exposes shielded-chain
wallet operations to JavaScript. Package name `react-native-hush`, version 0.1.0,
described as "HUSH library for React Native".

This is **a fork of `EdgeApp/react-native-zcash`, retargeted to HUSH** (a Zcash fork), not
an upstream clone and not a reference checkout. It is the newest and least finished of the
four repos in this effort — the version number was reset to 0.1.0 and the README still
carries the original Zcash text.

## 2. Current work in flight

The tree is clean and fully pushed — nothing is in flight, nothing is at risk on the
failing disk.

Two local commits sit on top of upstream's `v0.10.2`:

- **`c63ee57` "Fork react-native-zcash for HUSH cryptocurrency"** — the rename/retarget
  pass: renamed the package in `package.json`, added `react-native-hush.podspec` (the old
  `react-native-zcash.podspec` is still present alongside it), pointed
  `scripts/updateCheckpoints.ts` and `scripts/copyCheckpoints.ts` at HUSH, and committed
  seed checkpoints under `android/src/main/assets/hush/checkpoint/mainnet/`.
- **`64731ea` "Add HUSH gRPC test scripts"** — four exploratory scripts under `scripts/`:
  `test-hush-grpc.ts`, `test-local.ts`, `test-treestate.ts`, `test-wallet.ts` (~297 lines).

The shape of that second commit is the clearest signal of where the work stopped: it is
**connectivity spike work**, verifying that a HUSH lightwalletd server answers the gRPC
calls the Zcash SDK expects (block ranges, tree state, wallet sync) before committing to
the deeper native port. Pick the thread back up there.

This repo is the native half of a **four-repo HUSH integration**: the JS plugin in
`edge-currency-accountbased` imports this module, `edge-react-gui` registers it, and
`react-native-zcash` is kept alongside as the unmodified baseline to diff against.

## 3. State at handoff

- **Branch:** Edge-Wallet-Intergration (upstream: origin/Edge-Wallet-Intergration)
- **Uncommitted changes:** none — clean tree
- **Unpushed commits:** none — fully pushed
- **Recent commits:**

```
64731ea Add HUSH gRPC test scripts
c63ee57 Fork react-native-zcash for HUSH cryptocurrency
ebf34c0 v0.10.2
fea9df9 Update checkpoints
31e0a3a v0.10.1
```

Last local commit: 2025-12-13 (Paul Snow).

### ⚠️ Git object corruption in this checkout — do not trust this copy

This repo has **at least one unreadable object in its packfile**. Confirmed on
2026-07-21:

```
$ git log --oneline --graph -3
error: inflate: data stream error (incorrect header check)
error: Could not read b2e468eea23deb161ed93c1d683743d52196ca85
fatal: revision walk setup failed
```

The object is an 8-byte blob stored in
`.git/objects/pack/pack-ce117bb623a62f5aae6f6bbc3c7b7969a7b1e33c.pack`; its index entry is
intact (`git cat-file -t` reports `blob`, `-s` reports 8) but the zlib stream will not
inflate. Plain `git log --oneline` still works, which is why the corruption was easy to
miss.

This is consistent with the NVMe fault that is sending the machine to System76. The same
spot-check passed cleanly on the other three repos in this set. **Do not rsync or copy
this directory to the new machine — re-clone from GitHub.** All local commits are already
pushed to `origin`, so nothing is lost by discarding this working copy.

## 4. Claude setup

No Claude configuration in this repo. There is no `CLAUDE.md`, no `.claude/`, no
`.mcp.json`, and — unlike `edge-currency-accountbased` and `edge-react-gui` — no
`AGENTS.md` either.

## 5. Directives and conventions

Verified against `package.json`:

| Task | Command |
| --- | --- |
| Lint | `npm run lint` (`eslint .`) |
| Autofix | `npm run fix` |
| Build | `npm run prepare` (`husky install && rimraf lib && rollup -c && tsc`) |
| Android native build | `npm run build` (`cd android && gradle assemble ...`) |
| Kotlin format | `npm run fix-kotlin` (`ktlint --format 'android/src/**/*.kt'`) |
| Swift format | `npm run fix-swift` (`swift-format format -i ios/RNZcash.swift`) |
| Refresh checkpoints | `npm run update-checkpoints` |
| Refresh native sources | `npm run update-sources` |

- **There is no test script.** `package.json` defines no `test` target and there is no
  test directory — the `scripts/test-*.ts` files from `64731ea` are hand-run spikes, not a
  suite. Run them with `node -r sucrase/register scripts/test-hush-grpc.ts` (matching the
  invocation style of the other scripts in `package.json`); they hit a live server.
- **Node version:** not pinned. No `.nvmrc`, no `engines` field. Match the app repo
  (`edge-react-gui` requires Node >= 18).
- **Package manager:** both `package-lock.json` and `yarn.lock` are committed and scripts
  are npm-style; use `npm`. `.yarnrc` sets `--ignore-scripts true`.
- **Lint/format:** ESLint (`.eslintrc.json`) + Prettier (`.prettierrc.json`) +
  `.editorconfig`. Husky pre-commit runs `lint-staged && npm run prepare`.
- **Build output** is `lib/`, entry point `lib/rnzcash.rn.js` — note the entry filename is
  still the Zcash one, an artifact of the incomplete rename.
- **Known rename debt:** README still titled "react-native-zcash"; both
  `react-native-hush.podspec` and `react-native-zcash.podspec` exist; the iOS source is
  still `ios/RNZcash.swift`. Finish or deliberately keep these — do not assume they are
  bugs.

## 6. Resuming on another machine

1. **Clone fresh — mandatory here, not optional.** See the corruption warning in §3; this
   working copy has a damaged packfile object.
   ```
   git clone https://github.com/PaulSnow/DXC--react-native-hush.git
   cd DXC--react-native-hush
   git remote add upstream https://github.com/EdgeApp/react-native-zcash
   git checkout Edge-Wallet-Intergration
   git fsck --full        # confirm the fresh clone is clean
   git log --oneline -2   # expect 64731ea and c63ee57
   ```
2. **Credentials.** Both remotes are **HTTPS, not SSH**, so the deleted `~/.ssh` does not
   block you. `~/.aws` and `~/.gnupg` were deleted too — if commit signing was configured,
   `git commit` will fail until you re-import a GPG key or run
   `git config commit.gpgsign false`. Pushing needs a GitHub PAT or `gh auth login`.
3. **Install dependencies.** `node_modules/` is gitignored and is **not** in any archive.
   ```
   npm install
   ```
4. **Verify** without native toolchains:
   ```
   npm run lint
   npx tsc --noEmit
   npm run prepare   # rollup + tsc build into lib/
   ```
   There is no test suite to run.
5. **Native build requirements** — this is a native module, so the JS build above only
   proves the TypeScript layer:
   - **Android:** JDK 17, Android SDK + NDK, and a system `gradle` (the `build` script
     calls `gradle` directly, not a wrapper). The Zcash/HUSH Android SDK pulls large Rust
     artifacts.
   - **iOS:** macOS only — Xcode + CocoaPods, consuming `ZcashLightClientKit` via
     `react-native-hush.podspec`. Not buildable on Linux.
   Neither is needed just to read the code or continue the gRPC spike work.
6. **Re-establish the four-repo set.** This module is consumed by
   `edge-currency-accountbased` (`src/hush/`) and registered by `edge-react-gui`. To test
   changes end-to-end you will need all four checked out and the local copy linked into
   the app (`yarn link` / a `file:` dependency), plus a reachable HUSH lightwalletd
   endpoint for the gRPC scripts.
7. **Diff against the baseline** to see exactly what the fork changed:
   `git diff ebf34c0..HEAD` — or compare against the sibling `react-native-zcash`
   checkout, which is kept at that same commit for this purpose.
