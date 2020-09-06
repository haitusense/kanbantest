# kanbantest

GitHub Pages  
<https://haitusense.github.io/kanbantest/Pages/>  
<https://haitusense.github.io/kanbantest/Pages/mermaid.html>  
<https://haitusense.github.io/kanbantest/Pages/add.html>  

## Github制限

- レポジトリサイズ : なし（1GB未満推奨）
- ファイルサイズ : 50MB以上で警告、100MB以上のpushでブロック
  - Git LFSでより大きなファイルの取り扱い可能 (Free: 2GB, Enterprise : 5GB)
- ファイル数 : なし (100万個以上の実績あり)
- issue数 : ?
  - REST APIは30～100件単位
- Rate limiting (403 Forbidden)
  - REST API v3
    - for unauthenticated requests : 60 requests per hour
    - using Basic Authentication or OAuth : 5000 requests per hour
    - search : 30req/min (10req/min w/o authenticated)
  - GraphQL API v4
    - 5,000 points per hour (is not the same as 5,000 calls per hour)
- Github Pages (サイトホスティング) : プライベートでもパブリックアクセスになる
  - 1GB未満
  - 100GB/monthの帯域制限
- Project
  - 各プロジェクト列最大 2,500

## アクセストークン

<https://github.com/settings/tokens>

権限のスコープ:repo にチェック

## フローイメージ

```
[Planed]  ← REST        - テンプレート登録 (Travel No. + yaml Data)
 ↓        ← REST or web - 承認, 差戻コメント
[Process1]
 ↓        ← REST or web - 成績表（Travel No. + File, yaml or comment更新） 
[Process2]
 .        ← REST or web - 成績表（Travel No. + File, yaml or comment更新） 
 .
[Done]    - REST        → View（Gannt, Map） 

[request]  ← REST        - 依頼登録 (Travel No. + yaml Data)
 ↓         ← REST or web - 成績表
[Done]
```
