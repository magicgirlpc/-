#!/bin/zsh

set -eu

export PATH="/Users/hepevsmbp-2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/hepevsmbp-2/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
export CI=true

cd "/Users/hepevsmbp-2/.codex-portfolio"
exec pnpm run dev
