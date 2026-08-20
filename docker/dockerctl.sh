#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/compose.yml"
COMPOSE_OVERRIDE="${SCRIPT_DIR}/compose.override.yml"

show_help() {
  cat <<'EOF'
用法:
  ./dockerctl.sh <action> [extra args...]

说明:
  compose.yml          运行时（无 build）
  compose.override.yml 仅本地构建

支持动作:
  pull       拉取镜像
  build      本地构建
  up         拉取并启动（--no-build，适合使用已构建镜像部署）
  build-up   本地构建并启动
  down       停止
  logs / ps / config

示例:
  ./dockerctl.sh build-up
  export IMAGE_PREFIX=ghcr.io/<your-org>
  export IMAGE_TAG=latest
  ./dockerctl.sh up
EOF
}

dc() {
  docker compose -f "${COMPOSE_FILE}" "$@"
}

dc_build() {
  if [[ ! -f "${COMPOSE_OVERRIDE}" ]]; then
    echo "错误: 缺少 ${COMPOSE_OVERRIDE}"
    exit 1
  fi
  docker compose -f "${COMPOSE_FILE}" -f "${COMPOSE_OVERRIDE}" "$@"
}

if [[ "${1:-}" == "help" || "${1:-}" == "-h" || "${1:-}" == "--help" || $# -lt 1 ]]; then
  show_help
  exit 0
fi

ACTION="$1"
shift

case "${ACTION}" in
  pull)
    dc pull "$@"
    ;;
  build)
    dc_build build "$@"
    ;;
  up)
    dc up -d --pull missing --no-build "$@"
    ;;
  build-up)
    dc_build build "$@"
    dc_build up -d --build "$@"
    ;;
  down)
    dc down "$@"
    ;;
  restart)
    dc down "$@"
    dc up -d --pull missing --no-build "$@"
    ;;
  logs)
    dc logs -f "$@"
    ;;
  ps)
    dc ps "$@"
    ;;
  config)
    if [[ -f "${COMPOSE_OVERRIDE}" ]]; then
      dc_build config "$@"
    else
      dc config "$@"
    fi
    ;;
  *)
    echo "错误: 不支持的动作 '${ACTION}'"
    show_help
    exit 1
    ;;
esac
