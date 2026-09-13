#!/bin/sh

set -eu

managed_hook_marker="shave-managed-hook"
hooks_only=0

usage() {
  echo "Usage: ./scripts/setup.sh [--hooks-only]"
}

parse_arguments() {
  if [ "$#" -eq 0 ]; then
    return
  fi

  if [ "$#" -ne 1 ] || [ "$1" != "--hooks-only" ]; then
    usage
    exit 1
  fi

  hooks_only=1
}

is_ci_environment() {
  [ "${CI:-}" = "true" ] || [ "${CI:-}" = "1" ]
}

is_git_repository() {
  git rev-parse --git-dir >/dev/null 2>&1
}

get_hooks_dir() {
  git_dir=$(git rev-parse --git-dir)
  printf '%s/hooks\n' "$git_dir"
}

configure_hooks_dir() {
  hooks_dir=$1
  git config --local core.hooksPath "$hooks_dir"
  mkdir -p "$hooks_dir"
}

write_pre_commit() {
  cat > "$1" <<'EOF'
#!/bin/sh
# shave-managed-hook

set -eu

echo "Running pre-commit checks..."
exec pnpm run pre-commit
EOF
}

write_commit_msg() {
  cat > "$1" <<'EOF'
#!/bin/sh
# shave-managed-hook

set -eu

commit_message_file=${1:-}
if [ -z "$commit_message_file" ]; then
  echo "Missing commit message file"
  exit 1
fi

commit_message=$(sed -n '1p' "$commit_message_file")
commit_message_pattern='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]*\))?: .+'

if ! printf '%s\n' "$commit_message" | grep -Eq "$commit_message_pattern"; then
  echo "Invalid commit message format"
  echo "Expected format: <type>(<scope>): <message>"
  echo "Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert"
  echo "Received: $commit_message"
  exit 1
fi

echo "Commit message is valid"
EOF
}

write_post_merge() {
  cat > "$1" <<'EOF'
#!/bin/sh
# shave-managed-hook

set -eu

changed_files=$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD 2>/dev/null || true)
dependency_files='^(\.npmrc|package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|scripts/setup\.sh)$'

if ! printf '%s\n' "$changed_files" | grep -Eq "$dependency_files"; then
  echo "No dependency changes detected"
  exit 0
fi

echo "Dependencies changed, running setup..."
exec ./scripts/setup.sh
EOF
}

is_unmanaged_hook() {
  hook_path=$1
  [ -e "$hook_path" ] && ! grep -q "$managed_hook_marker" "$hook_path"
}

write_hook_file() {
  hook_path=$1
  writer=$2
  temporary_path="$hook_path.tmp.$$"

  "$writer" "$temporary_path"
  chmod 755 "$temporary_path"
  printf '%s\n' "$temporary_path"
}

install_hook() {
  hook_name=$1
  writer=$2
  hook_path="$hooks_dir/$hook_name"

  if is_unmanaged_hook "$hook_path"; then
    echo "Skipped unmanaged $hook_name hook"
    return
  fi

  temporary_path=$(write_hook_file "$hook_path" "$writer")

  if [ -f "$hook_path" ] && cmp -s "$temporary_path" "$hook_path"; then
    rm "$temporary_path"
    return
  fi

  mv "$temporary_path" "$hook_path"
  echo "Installed $hook_name hook"
}

install_hooks() {
  if is_ci_environment; then
    echo "CI environment detected, skipping git hooks"
    return
  fi

  if ! is_git_repository; then
    echo "Not a git repository, skipping git hooks"
    return
  fi

  hooks_dir=$(get_hooks_dir)
  configure_hooks_dir "$hooks_dir"
  install_hook "pre-commit" write_pre_commit
  install_hook "commit-msg" write_commit_msg
  install_hook "post-merge" write_post_merge
}

setup_project() {
  if ! command -v pnpm >/dev/null 2>&1; then
    echo "pnpm is required"
    exit 1
  fi

  pnpm install --frozen-lockfile
  pnpm run build
}

parse_arguments "$@"
install_hooks

if [ "$hooks_only" -eq 0 ]; then
  setup_project
fi
