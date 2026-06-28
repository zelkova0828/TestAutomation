#!/bin/bash

# 引数チェック
if [ -z "$1" ]; then
  echo "エラー: 案件名（プロジェクト名）を指定してください。"
  echo "使用例: ./run.sh sample_project"
  exit 1
fi

export TARGET_PROJECT="$1"
PROJECT_DIR="projects/${TARGET_PROJECT}"

# ディレクトリの存在確認
if [ ! -d "$PROJECT_DIR" ]; then
  echo "エラー: 指定されたプロジェクトが存在しません: $PROJECT_DIR"
  exit 1
fi

# test-results ディレクトリの作成
mkdir -p "${PROJECT_DIR}/test-results"

# テスト実行し、標準出力・標準エラー出力を execute.log にリダイレクト
# 同期的に実行して結果をログに保存
npx playwright test --config=playwright.config.ts > "${PROJECT_DIR}/test-results/execute.log" 2>&1
STATUS=$?

exit $STATUS
