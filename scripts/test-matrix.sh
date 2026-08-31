#!/usr/bin/env bash
# 在本机 nvm 安装的多个 Node 版本上跑同一套测试。
#
# 与 CI 矩阵等价，但不需要推送即可验证兼容性。
# 用法：npm run test:matrix  [或]  bash scripts/test-matrix.sh 18.20.8 24.18.0
set -uo pipefail

cd "$(dirname "$0")/.."

VERSIONS=("$@")
if [ ${#VERSIONS[@]} -eq 0 ]; then
  # 未指定时自动发现已安装版本
  mapfile -t VERSIONS < <(ls "$HOME/.nvm/versions/node" 2>/dev/null | sed 's/^v//' | sort -V)
fi

if [ ${#VERSIONS[@]} -eq 0 ]; then
  echo "未找到任何 nvm 安装的 Node 版本" >&2
  exit 1
fi

FILES=$(node -e "console.log(require('./package.json').scripts.test.match(/tests\/[a-z0-9-]+\.js/g).join(' '))")

failed=0
for v in "${VERSIONS[@]}"; do
  BIN="$HOME/.nvm/versions/node/v$v/bin/node"
  if [ ! -x "$BIN" ]; then
    printf '  %-10s 跳过（未安装）\n' "$v"
    continue
  fi

  out=$(timeout 600 "$BIN" --experimental-vm-modules --test $FILES 2>&1)
  summary=$(echo "$out" | grep -E '^(#|ℹ) (pass|fail)' | tr '\n' ' ')
  if echo "$out" | grep -qE '^(#|ℹ) fail [1-9]'; then
    printf '  %-10s FAIL  %s\n' "$v" "$summary"
    echo "$out" | grep -E '^not ok|^✖ ' | head -5 | sed 's/^/             /'
    failed=1
  else
    printf '  %-10s ok    %s\n' "$v" "$summary"
  fi
done

exit $failed
