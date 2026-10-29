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

## 你发的每一条，都在重新开始

不是内容不好。

是平台不知道你是谁。

同一个赛道里，有人发三条涨两百粉，你发三十条涨三个。差的不是努力——是**平台有没有把你分进对的那群人里**。

分错了，你再勤奋，也只是在给别人的爆款当分母。

## 起号不是创作，是答题

平台每推一条内容，都在问同一个问题：**这条该给谁看？**

你的前十条，就是在回答这个问题。

- 答对了，后面每一条都有人接
- 答错了，你越努力，越确定「我不适合做这个」

大多数人在第 20 条放弃，不是被市场拒绝，是被自己的前 10 条判了刑。

我们做的就一件事：**让你前十条不要答错。**

## 一条流水线，从选题到涨粉

**① 出排期** — 30 天、27 条内容。日期、阶段、格式、选题、钩子、该盯哪个数，一条不落。

**② 一个选题，切成 13 个平台** — 同一个观点，在 X 是 thread 骨架，在小红书是封面大字加标签，在 TikTok 是前三秒的冲突。不是一键同步：**一键同步等于在每个平台都不及格。**

**③ 每天自动发** — 挂上 cron，九点自己发。状态记在本地，不重发，错过的自动补。

**④ 数据回来，它给判定** — 高于账号中位数 1.5 倍：复制结构，换选题再做三条。低于 0.5 倍：不是赛道问题，是钩子问题，重写开头。你不用纠结，执行就行。

## 它不是什么

**不是刷量工具。** 买粉、互赞、群控——封号名单上全是这么干的人。

**不是一键同步。** 一份内容贴遍所有平台，算法一眼识破，谁也不给你流量。

**不是保证。** 它给路径和判断，不给「保证一万粉」。任何敢保证的，都在卖你一个会到期的希望。

## 适合谁

- 发了三个月，粉丝还是个位数的人
- 内容有东西，但就是进不了推荐的人
- 已经起过一个号，想把动作沉淀成 SOP 的人
- 要做一个新号，不想再从零试错的人

## 不适合谁

- 想一夜爆红的
- 不愿意连续发 30 天的
- 指望工具替自己思考的

如果你属于后三种，关掉这个页面，把时间留给别的事。

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

## 加入社群

**[→ 进群，把你的账号丢进来，我们拆给你看](https://t.me/beinfluencer)**

群里只聊两件事：平台实测数据、下一个选题。不发鸡汤，不卖课。

## License

[MIT](LICENSE)
