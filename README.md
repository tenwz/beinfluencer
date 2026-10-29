<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/platforms-dark.svg">
    <img src="assets/platforms-light.svg" width="1200" alt="X · TikTok · YouTube · Instagram · Facebook · Reddit · Threads · Telegram · Discord · WeChat · Xiaohongshu · Bilibili · Weibo">
  </picture>
</p>

<p align="center">
  <img src="assets/logo.svg" width="96" alt="beinfluencer">
</p>

<h1 align="center">beinfluencer</h1>

<p align="center">
  <strong>让任何账号，在任何平台，成为 influencer。</strong>
</p>

---

## 账号不缺，注意力缺

每天有几千万条内容被发出去，绝大多数没有人看见。

问题通常不在内容质量，而在更前面：不知道对谁说、不知道这个平台奖励什么、也不知道发出去的哪一条真的有用。于是靠灵感写，靠运气传播，三周之后断更。

成为 influencer 不是天赋，是一套可以重复的动作。beinfluencer 把这套动作具体化：**给一个账号和一个平台，输出一份能执行的方案。**

## 它做什么

输入一个账号，比如「一个做独立开发的技术人」「一家卖猫粮的小公司」「一个刚注册的出海号」；再选一个平台。

输出四件事：

- **定位** — 这个人设代表谁、为谁说话、凭什么被记住
- **内容** — 哪些选题值得做，用什么形态承载，写多少、写多久
- **分发** — 这个平台的算法奖励什么，什么时候发，发完做什么
- **复盘** — 哪一条真的有效，为什么，下一轮怎么改

## 平台不是同一件事

X 奖励观点，YouTube 奖励留存，TikTok 奖励前三秒，Reddit 奖励有用，小红书奖励真实，LinkedIn 奖励专业判断。

同一个账号，同一批内容，换个平台就得重做一遍。beinfluencer 的每一步都按平台区分，不做「一键同步所有平台」这种把内容稀释掉的事。

## 任何账号

新号冷启动、小号找回节奏、企业号做信任、个人号做长期资产 —— 起点不同，流程是同一套。

## 状态

可运行。排期、改写、发布、复盘已经串成闭环。

## 使用

```bash
npm install

# 1. 出排期
npx tsx src/cli.ts plan --platform xiaohongshu \
  --account "做独立开发的技术人" --niche "独立开发/出海" \
  --json --out plan.json

# 2. 一个选题改写成多平台版本
npx tsx src/cli.ts adapt --topic "为什么你的笔记没人看" \
  --niche "独立开发" --to x,xiaohongshu,tiktok

# 3. 发布（默认 dry-run，只打印 payload）
npx tsx src/cli.ts tick --plan plan.json --to postiz --dry-run
npx tsx src/cli.ts tick --plan plan.json --to sau --dry-run

# 4. 复盘：判断该复制、该保留、还是该换钩子
npx tsx src/cli.ts review --metrics metrics.json
```

`tick` 只发「今天到期且没发过」的内容，发过的记在 `.beinfluencer/published.json`，错过的下次自动补上。挂到 cron 就是无人值守：

```bash
0 9 * * * cd /path/beinfluencer && npx tsx src/cli.ts tick --plan plan.json --to postiz >> .beinfluencer/tick.log 2>&1
```

review 的输入格式：

```json
[{ "topic": "最常见的 3 个错误", "impressions": 4200, "interactions": 210, "follows": 65 }]
```

它只用「和账号自己的中位数比」来判断赢家和淘汰，不套平台的绝对阈值——那些阈值平台从没公开过。

环境变量：`POSTIZ_API_KEY`、`POSTIZ_INTEGRATION_ID`（Postiz，官方 SDK）；`SAU_CMD`、`SAU_ARGS`（social-auto-upload，国内平台）。

## 文档

- [平台起号知识库](docs/platforms/README.md) —— 13 个平台从 0 到 1 的起号方法
- [文案](docs/copy.md) —— 标语、承诺口径与使用边界
- [生态调研](docs/ecosystem.md) —— 可直接复用的开源项目与许可风险

## License

[MIT](LICENSE)
