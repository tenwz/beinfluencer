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
  <strong>30 天，一万粉的路径。</strong>
</p>

<p align="center">
  任何账号 · 任何平台 · 不靠灵感，靠排期
</p>

<p align="center">
  <a href="https://t.me/beinfluencer"><strong>→ 加入社群，领 30 天排期模板</strong></a>
</p>

---

## 大多数人不是不会发，是在猜

猜平台喜欢什么，猜几点发，猜哪条会爆。

猜三个月，粉丝两百，然后断更。

我们不猜。**13 个平台的推荐逻辑、内容形态、首测门槛，已经拆成一条条可以照做的动作。** 你要做的只有一件事：照着跑。

## 一条流水线，从选题到涨粉

### ① 出排期

一条命令，拿到 30 天、27 条内容。每一条都有：日期、阶段、格式、选题、钩子、该盯的那个数。

### ② 一个选题，切成 13 个平台

同一个观点，在 X 是 thread 骨架，在小红书是封面大字加标签，在 TikTok 是前三秒的冲突，在公众号是小标题结构。

不是一键同步，是每个平台重写一遍。**一键同步 = 在每个平台都不及格。**

### ③ 每天早上自动发

挂上 cron，九点自己发。你醒来，内容已经出去了，状态记在本地，不会重发，错过的自动补。

### ④ 数据回来，它告诉你下一步

- 高于账号中位数 **1.5 倍**：结构有效，复制它，换选题再做 3 条
- 低于 **0.5 倍**：不是赛道问题，是钩子问题，重写开头
- 中间的：保留观察，下一轮只改一个变量

你不用纠结。它给判定，你执行。

## 它不是什么

**不是刷量工具。** 买粉、互赞、群控，我们不做，也劝你别碰——那是把自己账号往封号名单上送。

**不是一键同步。** 一份内容贴遍所有平台，算法一眼识破，每个平台都不给你流量。

**不是承诺。** 它给的是路径和判断，不是「保证一万粉」。任何敢保证的，都在卖你一个会到期的希望。

## 装

```bash
npm install

npx tsx src/cli.ts plan --platform xiaohongshu \
  --account "做独立开发的技术人" --niche "独立开发/出海"
```

```
# 小红书 · 30 天起号排期
共 27 条内容：定标签 3 条 · 测试 7 条 · 收敛 8 条 · 放大 9 条

2026-11-02  D1   定标签   图文 6–9 张     自我介绍：我是谁、在为谁解决什么
2026-11-06  D5   测试     视频 15–60 秒   独立开发/出海 前后对比：改了哪一处
2026-11-09  D8   测试     图文 6–9 张     回答一个被问最多的问题
2026-11-22  D21  放大     合集            可保存清单：执行步骤
```

再往下：

```bash
npx tsx src/cli.ts adapt  --topic "为什么你的笔记没人看" --to x,xiaohongshu,tiktok
npx tsx src/cli.ts tick   --plan plan.json --to postiz
npx tsx src/cli.ts review --metrics metrics.json
```

## 谁在用

正在起号的新号、想找回节奏的小号、要做信任的企业号、准备出海的团队。

起点不同，流程是同一套。

## 加入社群

**[→ 进群，把你的账号丢进来，我们拆给你看](https://t.me/beinfluencer)**

群里只聊两件事：平台实测数据、下一个选题。不发鸡汤，不卖课。

## License

[MIT](LICENSE)
