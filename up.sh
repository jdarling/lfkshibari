#!/bin/bash
# up.sh - Serve the static site in docs/ using an nginx Docker container

set -o errexit -o pipefail -o noclobber -o nounset

trap 'echo "ERROR: Script failed at line $LINENO while executing: $BASH_COMMAND with exit code $?"' ERR

declare SCRIPT_NAME=$(basename "$0")
declare SOURCE="${BASH_SOURCE[0]}"
declare DIR=""

while [ -h "${SOURCE}" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "${SOURCE}" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "${SOURCE}")"
  [[ ${SOURCE} != /* ]] && SOURCE="${DIR}/${SOURCE}" # if $SOURCE was a relative symlink, resolve it relative to the symlink's location
done
declare SCRIPT_DIR="$( cd -P "$( dirname "${SOURCE}" )" >/dev/null 2>&1 && pwd )"

declare PORT=8083
declare IMAGE="nginx:alpine"
declare CONTENT_DIR="${SCRIPT_DIR}/docs"
declare CONTAINER_NAME="lfkshibari"
declare DETACH=false
declare -a ARGS=()

function showHelp() {
  local exitCode=${1:-0}
  local errorMessage=${2:-""}
  echo "${SCRIPT_NAME} <options>"
  echo ""
  echo "Serve the static site in docs/ using an nginx Docker container."
  echo ""
  echo "Options:"
  echo "  -p, --port <port>    - Host port to expose (default: ${PORT})"
  echo "  -i, --image <image>  - Docker image to use (default: ${IMAGE})"
  echo "  -c, --content <dir>  - Directory to serve (default: docs/)"
  echo "  -n, --name <name>    - Container name (default: ${CONTAINER_NAME})"
  echo "  -d, --detach         - Run the container in the background"
  echo "  -h, --help           - Show this screen"
  echo ""
  echo "NOTE: All other arguments are passed through to 'docker run'."
  echo ""
  if [[ -n "${errorMessage}" ]]; then
    echo "ERROR: ${errorMessage}"
    echo ""
  fi
  exit ${exitCode}
}

function parseArgs() {
  local key=""
  while [[ $# -gt 0 ]]; do
    key="$1"
    case "${key}" in
      -h|--help)
        showHelp 0
      ;;
      -p=*|--port=*)
        PORT="${key#*=}"
        shift
      ;;
      -p|--port)
        PORT="$2"
        shift 2
      ;;
      -i=*|--image=*)
        IMAGE="${key#*=}"
        shift
      ;;
      -i|--image)
        IMAGE="$2"
        shift 2
      ;;
      -c=*|--content=*)
        CONTENT_DIR="${key#*=}"
        shift
      ;;
      -c|--content)
        CONTENT_DIR="$2"
        shift 2
      ;;
      -n=*|--name=*)
        CONTAINER_NAME="${key#*=}"
        shift
      ;;
      -n|--name)
        CONTAINER_NAME="$2"
        shift 2
      ;;
      -d|--detach)
        DETACH=true
        shift
      ;;
      *)
        ARGS+=("${key}")
        shift
      ;;
    esac
  done
}

parseArgs "$@"

if [[ ! -d "${CONTENT_DIR}" ]]; then
  showHelp 1 "Content directory not found: ${CONTENT_DIR}"
fi

declare -a RUN_ARGS=("--rm" "--name" "${CONTAINER_NAME}" "-p" "${PORT}:80")
if [[ ${DETACH} == true ]]; then
  RUN_ARGS+=("-d")
fi
RUN_ARGS+=("-v" "${CONTENT_DIR}:/usr/share/nginx/html:ro")

declare -a CMD=(docker run "${RUN_ARGS[@]}" "${ARGS[@]}" "${IMAGE}")

echo "Serving ${CONTENT_DIR} at http://localhost:${PORT}"
"${CMD[@]}"
