---
title: "Roadmap"
description: "下一步做什么，公开可见"

# 三档看板数据。发布后从对应档位移除，进入 changelog。
# 每条：title (必填) · desc (必填) · version (可选，预计发布版本)

planned:
  - title: "节奏型自由组合编辑器 V2"
    desc: "支持双声部（军鼓 + 底鼓）、拍号扩展（3/4 · 6/8）、模板收藏与分享"
  - title: "MIDI 谱面导入"
    desc: "导入标准 MIDI 文件作为练习谱面，自动映射到 WhiplashMaster 节奏型库"
  - title: "智能曲谱识别"
    desc: "拍照上传实体乐谱，OCR 识别节奏部分并转为可练习的组合模板"
  - title: "多平台数据云同步"
    desc: "端到端加密的练习记录跨设备同步，不依赖登录，基于 device pairing"
  - title: "HarmonyOS 原生版首发"
    desc: "ArkTS 端功能追平 Android/iOS，进入 AppGallery 上架流程"

in_progress:
  - title: "内置节拍器重启修复"
    desc: "解决内置节拍器长时间练习后偶发失同步的问题，采用 Kotlin Coroutine Scheduler 重写"
  - title: "BPM 智能推荐 V1.1"
    desc: "基于最近 3 次练习评级动态推荐下一次 BPM，冷启动策略优化"
  - title: "开发数据本地备份"
    desc: "支持练习记录、设置、组合模板一键导出为 ZIP 归档，用于换机迁移"

beta:
  - title: "首页 IA 重设计"
    desc: "首页信息架构升级，快速 BPM 区从 5 固定 → 3 锚点 + 上次 + 推荐"
  - title: "多主题联名扩展"
    desc: "第 6 套「蜂蜜黄」（sweet noise M1 联名）已发布 · 更多联名主题排期中"
---

## 状态说明

- **规划中**：已有需求依据（用户反馈 / 竞品 / 团队讨论），进入排期候选池，未开始编码
- **开发中**：已在 feature 分支实施，通常预期 1-2 个版本内合入
- **内测中**：已在最新 release 中作为实验性功能开放，等待稳定后转正

具体时间表不承诺 — WhiplashMaster 是独立开发者项目，节奏取决于业余精力。**想加速某个功能？** [去反馈页留言](/feedback/)，被提及次数多的功能会前置排期。
