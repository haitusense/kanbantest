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
- Github Pages (サイトホスティング) : プライベートでもパブリックアクセスになる
  - 1GB未満
  - 100GB/monthの帯域制限

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
