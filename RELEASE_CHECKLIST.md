# リリースチェックリスト

GitHubActionsを使用した自動ビルドと公開を行うための設定チェックリストです。

## GitHubリポジトリの設定

- [ ] リポジトリの「Settings」→「Actions」→「General」で、「Workflow permissions」を「Read and write permissions」に設定
- [ ] リポジトリの「Settings」→「Actions」→「General」で、「Allow GitHub Actions to create and approve pull requests」にチェック

## 初回リリース手順

1. [ ] ローカルでアプリケーションをビルドしてテスト
   ```bash
   npm run build:mac
   ```

2. [ ] 初回バージョンタグを作成
   ```bash
   git tag v1.0.0
   ```

3. [ ] タグをプッシュ
   ```bash
   git push origin v1.0.0
   ```

4. [ ] GitHubActionsのワークフローが実行されることを確認
   - リポジトリの「Actions」タブで確認できます

5. [ ] リリースが正常に作成されたことを確認
   - リポジトリの「Releases」セクションで確認できます

## 次回以降のリリース手順

1. [ ] コードを変更し、コミット
2. [ ] バージョンを更新
   ```bash
   npm run version:patch  # または version:minor, version:major
   ```
3. [ ] 変更をプッシュし、タグも一緒にプッシュ
   ```bash
   npm run release
   ```
4. [ ] GitHubActionsのワークフローが実行されることを確認
5. [ ] リリースが正常に作成されたことを確認

## トラブルシューティング

### ビルドが失敗する場合

- ワークフローのログを確認
- `GH_TOKEN` が正しく設定されているか確認
- リポジトリの権限設定を確認

### 自動更新が機能しない場合

- `electron-builder.yml` の設定を確認
- `package.json` の `build.publish` 設定を確認
- GitHubリリースが正しく公開されているか確認 