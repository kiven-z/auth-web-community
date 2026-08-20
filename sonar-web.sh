#!/usr/bin/env bash
# 扫描当前前端工程到 SonarQube
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SONAR_HOST_URL="${SONAR_HOST_URL:-http://192.168.3.4:19000}"
SONAR_TOKEN="${SONAR_TOKEN:-squ_153105557ce4791378968772dc2bd2292d4436ff}"

echo "==> Sonar 扫描 host=$SONAR_HOST_URL"
cd "$ROOT"
pnpm dlx @sonar/scan \
  -Dsonar.host.url="$SONAR_HOST_URL" \
  -Dsonar.token="$SONAR_TOKEN"

echo "Sonar 扫描完成"
