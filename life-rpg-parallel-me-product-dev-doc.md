# Life RPG + Parallel Me 产品开发文档

版本：v0.1  
日期：2026-06-17  
产品代号：Life RPG + Parallel Me  
建议正式名称：PathForge / LifeFork / Parallel RPG / QuestMe  
目标读者：产品经理、独立开发者、AI 应用工程师、前端工程师、编程 Agent

---

## 0. 文档说明

本文档用于规划一个结合 Life RPG 与 Parallel Me 的 AI 产品。

产品核心思想：

> 用户不是在写待办事项，而是在模拟未来、选择人生路线、执行任务、升级技能，并持续复盘自己的成长路径。

它把三类产品能力融合在一起：

1. 平行人生模拟：帮助用户看见不同选择可能带来的路径。
2. RPG 成长系统：把目标拆成主线、支线、技能树、属性和成就。
3. AI 复盘系统：根据用户的执行反馈，调整路线、任务难度和人生叙事。

本文档目标：

- 明确产品定位。
- 定义 MVP 范围。
- 设计核心用户流程。
- 设计 AI 生成逻辑。
- 设计数据结构。
- 设计页面和交互。
- 给出开发路线图。
- 给出可直接交给编程 Agent 的执行提示词。

---

## 1. 产品概述

### 1.1 产品名称

暂定名称：

- Life RPG + Parallel Me

更适合开源传播的名称：

- PathForge
- LifeFork
- Parallel RPG
- QuestMe
- AltLife
- LifeSim OS
- Questline

推荐名称：

> PathForge

推荐理由：

- Forge 有“锻造路径”的感觉。
- 比 Life RPG 更有产品感。
- 比 Parallel Me 更适合长期扩展。
- 可同时承载人生模拟、任务系统和成长系统。

如果要保留直观表达，可使用：

> PathForge: Simulate your possible futures. Choose one. Turn it into quests.

### 1.2 一句话定位

PathForge 是一个 AI 驱动的人生路线模拟与 RPG 成长系统，帮助用户将重大选择、长期目标和日常任务转化为可执行的成长主线。

### 1.3 产品愿景

让每个人都能像经营游戏角色一样经营自己的人生方向。

不是机械地管理任务，而是理解：

- 我可能走向哪些未来？
- 每条未来路线需要什么能力？
- 我现在应该做哪些任务？
- 我过去一周的行为让我更接近哪条人生线？
- 我是否需要改路线、降难度、换节奏？

### 1.4 产品核心体验

用户输入一个目标或困惑，例如：

```text
我想在一年内成为 AI 产品开发者，但我也在纠结要不要考研。
```

系统生成：

```text
路线 A：研究型路线
路线 B：产品开发型路线
路线 C：混合型路线
```

每条路线包含：

- 未来场景
- 成长代价
- 关键能力
- 风险提示
- 30 天任务地图
- 90 天里程碑
- 一年后的可能状态

用户选择一条路线作为当前主线后，系统会把它变成 RPG：

- 主线任务
- 支线任务
- 每日任务
- 技能树
- 属性值
- 成就
- 剧情节点
- 每周复盘
- 路线偏移检测

### 1.5 产品不是做什么

它不是：

- 普通 Todo List。
- 普通习惯打卡。
- 普通日记软件。
- 心理治疗工具。
- 占卜或命运预测工具。
- 绝对正确的人生规划工具。

它应该明确告诉用户：

> 系统生成的是可思考的模拟路线，不是确定的人生预言。

---

## 2. 核心产品哲学

### 2.1 人不缺任务，缺的是路线感

大多数生产力工具只关心：

```text
今天做什么？
```

但用户真正困惑的是：

```text
我为什么要做这些？
这些任务会把我带到哪里？
我做的事情是否和我想成为的人一致？
```

PathForge 的价值是把任务放回人生路线中。

### 2.2 人生规划应该是可模拟的，而不是一次性决定

传统规划喜欢给一个答案：

```text
你应该走 A 路线。
```

PathForge 应该展示多个可能：

```text
A 路线的收益是什么？
B 路线的代价是什么？
C 路线的混合策略是什么？
```

用户不是被 AI 指挥，而是用 AI 扩展自己的视野。

### 2.3 RPG 化不是幼稚化，而是反馈结构化

RPG 系统的本质不是“游戏化贴皮”，而是把成长拆成：

- 目标
- 行动
- 反馈
- 技能
- 属性
- 阶段
- 奖励
- 剧情

这些结构天然适合个人成长。

### 2.4 产品应避免制造焦虑

PathForge 不能变成一个催促用户不停完成任务的压力机器。

设计原则：

- 允许低能量日。
- 允许路线调整。
- 允许任务失败。
- 允许用户暂停。
- 复盘强调理解，不强调审判。

---

## 3. 目标用户

### 3.1 核心用户 1：人生阶段选择者

典型场景：

- 大学生选择考研、就业、创业。
- 职场新人选择技术、产品、管理。
- 创作者选择做内容、做产品、做商业化。
- 开发者选择开源、求职、独立产品。

痛点：

- 面临多个选择，不知道怎么权衡。
- 很难看见每条选择的长期影响。
- 目标太大，不知道从哪里开始。

产品价值：

- 生成多条可比较路线。
- 把选择拆成短期可验证任务。
- 帮用户用 30 天行动测试路线。

### 3.2 核心用户 2：长期目标执行者

典型场景：

- 想一年内成为某类人才。
- 想做一个开源项目。
- 想建立个人品牌。
- 想学习一门复杂技能。

痛点：

- 目标很大，日常执行容易断。
- 缺少反馈和进度感。
- 不知道自己的行动是否有效。

产品价值：

- 将目标转化为任务链。
- 用属性和技能树展示成长。
- 用每周复盘校准方向。

### 3.3 核心用户 3：自我探索型用户

典型场景：

- 不确定自己想成为什么样的人。
- 想探索不同生活可能性。
- 喜欢记录、自省、构建人生系统。

痛点：

- 想法很多，但没有结构。
- 对未来模糊。
- 自我认知缺少外部镜子。

产品价值：

- 用平行人生帮助用户看见选项。
- 用剧情化方式降低探索门槛。
- 用复盘帮助用户形成稳定认知。

### 3.4 用户画像细化

#### 画像1：大学生小明

**基本信息**
- 姓名：小明
- 年龄：21岁
- 职业：大三计算机专业学生
- 教育背景：本科在读
- 收入水平：无固定收入，靠父母支持

**具体场景**
- 正在纠结考研还是直接就业
- 想学习AI开发但不知道从何开始
- 每天有3-4小时空闲时间
- 喜欢尝试新工具和新技术

**痛点**
- 面临多个选择，不知道怎么权衡
- 很难看见每条选择的长期影响
- 目标太大，不知道从哪里开始
- 缺少有经验的人指导

**目标**
- 明确未来发展方向
- 找到可执行的学习路径
- 在毕业前积累有价值的项目经验

**使用产品的动机**
- 希望通过AI模拟看清不同选择的结果
- 希望把大目标拆成可执行的小任务
- 希望通过游戏化方式保持学习动力

#### 画像2：职场新人小李

**基本信息**
- 姓名：小李
- 年龄：25岁
- 职业：初级前端工程师
- 教育背景：本科毕业2年
- 收入水平：月薪15k

**具体场景**
- 想从初级工程师成长为高级工程师
- 想学习后端技术成为全栈工程师
- 工作日时间有限，周末有较多空闲
- 对职业发展感到迷茫

**痛点**
- 目标很大，日常执行容易断
- 缺少反馈和进度感
- 不知道自己的行动是否有效
- 工作压力大，容易放弃个人成长

**目标**
- 1年内成为中级工程师
- 3年内成为全栈工程师
- 建立个人技术品牌

**使用产品的动机**
- 希望把职业目标转化为可执行的任务
- 希望通过属性和技能树看到成长进度
- 希望通过每周复盘校准方向

#### 画像3：创作者小王

**基本信息**
- 姓名：小王
- 年龄：28岁
- 职业：自由撰稿人
- 教育背景：文学硕士
- 收入水平：月收入不稳定，约8k-15k

**具体场景**
- 想建立个人写作品牌
- 想从写稿转向做内容产品
- 时间自由但容易拖延
- 喜欢记录和自省

**痛点**
- 想法很多，但没有结构
- 对未来模糊，不确定方向
- 自我认知缺少外部镜子
- 缺少系统性的成长框架

**目标**
- 建立稳定的写作习惯
- 打造个人内容品牌
- 实现从写稿到产品的转型

**使用产品的动机**
- 希望通过平行人生看见不同选择
- 希望通过剧情化方式降低探索门槛
- 希望通过复盘形成稳定认知

#### 画像4：开发者小张

**基本信息**
- 姓名：小张
- 年龄：27岁
- 职业：后端工程师
- 教育背景：计算机本科
- 收入水平：月薪20k

**具体场景**
- 想做开源项目但不知道做什么
- 想从后端转向AI工程
- 有技术能力但缺少产品思维
- 想建立个人技术影响力

**痛点**
- 有技术能力但缺少方向
- 想做项目但不知道从何开始
- 缺少产品思维和用户视角
- 想建立影响力但不知道怎么做

**目标**
- 做出有影响力的开源项目
- 转型为AI工程师
- 建立个人技术品牌

**使用产品的动机**
- 希望通过AI模拟找到合适的项目方向
- 希望把大目标拆成可执行的任务
- 希望通过游戏化方式保持动力

#### 画像5：自由职业者小陈

**基本信息**
- 姓名：小陈
- 年龄：30岁
- 职业：独立设计师
- 教育背景：设计专业本科
- 收入水平：月收入不稳定，约10k-20k

**具体场景**
- 从公司离职成为自由职业者
- 想建立稳定的设计工作室
- 时间自由但容易迷失方向
- 需要同时处理多个项目

**痛点**
- 缺少系统性的事业规划
- 时间管理困难，容易拖延
- 缺少反馈和进度感
- 需要同时处理多个角色

**目标**
- 建立稳定的设计工作室
- 实现收入稳定增长
- 平衡工作和生活

**使用产品的动机**
- 希望通过AI模拟规划事业方向
- 希望把大目标拆成可执行的任务
- 希望通过复盘优化时间管理

### 3.5 早期最适合切入的人群

MVP 最适合面向：

> 18 到 30 岁，有长期目标、喜欢 AI 工具、愿意尝试自我管理产品的开发者、学生和创作者。

原因：

- 他们更容易接受 RPG 化表达。
- 他们更常面临人生路线选择。
- 他们愿意在社交平台分享生成结果。
- 他们有明确的成长焦虑和探索需求。

### 3.6 用户旅程地图

#### 典型用户旅程：大学生小明

**阶段1：认知阶段**
- 用户行为：在社交媒体看到PathForge的分享
- 用户想法：这是什么工具？能帮我解决考研还是就业的问题吗？
- 用户感受：好奇、有点怀疑
- 接触点：社交媒体、朋友推荐
- 痛点：不确定工具是否靠谱
- 改进机会：提供清晰的产品介绍和用户案例

**阶段2：考虑阶段**
- 用户行为：访问产品网站，了解功能
- 用户想法：这个工具能模拟不同选择的结果吗？
- 用户感受：感兴趣、想尝试
- 接触点：产品网站、功能介绍
- 痛点：不确定AI生成的内容是否准确
- 改进机会：提供示例和用户评价

**阶段3：决定阶段**
- 用户行为：注册账号，输入目标
- 用户想法：试试看AI会给我什么建议
- 用户感受：期待、有点紧张
- 接触点：注册流程、目标输入
- 痛点：输入过程可能太复杂
- 改进机会：简化输入流程，提供引导

**阶段4：使用阶段**
- 用户行为：查看AI生成的路线，选择主线，执行任务
- 用户想法：这个路线听起来不错，我试试看
- 用户感受：兴奋、有动力
- 接触点：路线展示、任务系统
- 痛点：任务可能太难或太简单
- 改进机会：提供任务难度调整和降级选项

**阶段5：复盘阶段**
- 用户行为：完成一周任务，查看复盘报告
- 用户想法：我这周做得怎么样？需要调整方向吗？
- 用户感受：反思、有收获
- 接触点：复盘报告、属性变化
- 痛点：复盘可能太抽象或不具体
- 改进机会：提供具体的改进建议和下一步行动

### 3.7 用户验证计划

#### 用户访谈计划

**目标**：验证产品假设，了解用户真实需求

**访谈对象**：10-15个目标用户
- 大学生：3-4人
- 职场新人：3-4人
- 创作者：2-3人
- 开发者：2-3人
- 自由职业者：1-2人

**访谈内容**：
1. 当前面临的人生选择或困惑
2. 如何做人生规划和决策
3. 使用过哪些生产力或成长工具
4. 对游戏化和AI辅助的看法
5. 对PathForge概念的反馈

**访谈方法**：
- 一对一深度访谈
- 每次30-45分钟
- 录音并整理成文字
- 分析共同点和差异

#### 原型测试计划

**目标**：验证产品设计和用户体验

**测试对象**：5-8个目标用户

**测试内容**：
1. 产品概念理解测试
2. 核心流程可用性测试
3. 界面设计偏好测试
4. 功能优先级排序

**测试方法**：
- 可用性测试
- A/B测试
- 用户反馈收集
- 迭代优化

#### MVP测试计划

**目标**：验证产品价值和用户接受度

**测试对象**：100-200个早期用户

**测试内容**：
1. 用户注册和激活率
2. 路线选择和任务完成率
3. 用户留存和活跃度
4. 用户满意度和NPS

**测试方法**：
- 灰度发布
- 数据埋点分析
- 用户反馈收集
- 快速迭代优化

#### 反馈收集机制

**收集渠道**：
1. 产品内反馈入口
2. 用户访谈
3. 社交媒体监控
4. 社区讨论

**收集内容**：
1. 功能使用反馈
2. 问题和bug报告
3. 功能建议和需求
4. 用户体验评价

**处理流程**：
1. 收集和整理反馈
2. 分析和分类反馈
3. 确定优先级和解决方案
4. 实施改进并通知用户

---

## 4. 市场分析

### 4.1 市场规模估算

#### 总可用市场（TAM）

全球个人成长与生产力工具市场：

- 2025年市场规模：约150亿美元
- 预计年增长率：12-15%
- 主要驱动因素：远程工作普及、个人发展意识提升、AI技术应用

#### 可服务市场（SAM）

目标细分市场（AI驱动的个人成长与人生规划工具）：

- 2025年市场规模：约8亿美元
- 预计年增长率：25-30%
- 主要用户群体：18-35岁、有成长焦虑、愿意尝试AI工具的用户

#### 可获得市场（SOM）

MVP阶段可获得市场：

- 目标用户：开发者、学生、创作者
- 预计用户规模：50-100万潜在用户
- 首年目标用户：1-5万活跃用户
- 预计转化率：5-10%

#### 市场增长趋势

1. **AI工具接受度提升**：用户对AI辅助决策的接受度逐年提高
2. **个人成长需求增长**：年轻人对自我提升和人生规划的需求持续增长
3. **游戏化应用普及**：游戏化元素在非游戏领域的应用越来越广泛
4. **远程工作常态化**：远程工作使得个人时间管理更加重要

### 4.2 竞品分析

#### 直接竞品

| 产品 | 定位 | 优势 | 劣势 | 价格 |
|------|------|------|------|------|
| Habitica | 游戏化习惯养成 | 成熟的游戏化系统、社区活跃 | 缺少AI能力、任务规划简单 | 免费+$4.99/月 |
| LifeRPG | 人生RPG化 | 简单易用、移动端体验好 | 功能单一、缺少路线规划 | 免费+$2.99/月 |
| QuestLife | 任务游戏化 | 界面美观、成就系统丰富 | 缺少AI能力、用户群体窄 | 免费+$3.99/月 |

#### 间接竞品

| 产品 | 定位 | 优势 | 劣势 | 价格 |
|------|------|------|------|------|
| Todoist | 任务管理 | 功能完善、跨平台同步 | 缺少游戏化、无AI能力 | 免费+$4/月 |
| Notion | 全能工作空间 | 高度自定义、功能强大 | 学习成本高、缺少游戏化 | 免费+$8/月 |
| Obsidian | 知识管理 | 双向链接、本地优先 | 缺少任务管理、无AI能力 | 免费+$50/年 |

#### 模拟类应用

| 产品 | 定位 | 优势 | 劣势 | 价格 |
|------|------|------|------|------|
| 人生模拟器 | 人生选择模拟 | 有趣的模拟体验 | 缺少实际执行、无AI能力 | 免费+内购 |
| 平行人生 | 平行世界探索 | 创意独特、故事性强 | 缺少任务系统、无实际价值 | 免费+内购 |

#### 竞品对比矩阵

```
                    游戏化程度    AI集成度    路线规划    任务管理    个人成长
Habitica            高            低          低          中          低
LifeRPG             中            低          低          中          低
QuestLife           高            低          低          中          低
Todoist             低            低          低          高          低
Notion              低            中          中          高          中
PathForge           高            高          高          高          高
```

#### 差异化机会

1. **AI驱动的路线规划**：竞品普遍缺少AI能力，PathForge可以提供智能化的人生路线模拟
2. **游戏化与实际执行结合**：竞品要么偏游戏化，要么偏任务管理，PathForge可以将两者完美结合
3. **长期成长视角**：竞品多关注短期习惯养成，PathForge可以提供长期的人生规划视角
4. **个性化复盘系统**：竞品缺少基于AI的个性化复盘和路线调整能力

### 4.3 市场定位图

#### 定位维度

1. **游戏化程度**：产品中游戏化元素的丰富程度
2. **AI集成度**：产品中AI能力的应用程度

#### 竞品定位

```
高游戏化
    │
    │   Habitica ●    QuestLife ●
    │                   PathForge ●
    │
    │   LifeRPG ●
    │
    │                           Notion ●
    │   Todoist ●
    │                           Obsidian ●
    │
低游戏化─────────────────────────────────────高AI集成
```

#### 产品定位

PathForge定位为**高游戏化、高AI集成**的个人成长工具，填补市场空白：

- **差异化定位**：结合游戏化体验和AI能力，提供独特的个人成长解决方案
- **目标用户**：有成长焦虑、愿意尝试新工具的年轻用户
- **价值主张**：将人生规划变成可执行的游戏化体验

### 4.4 SWOT分析

#### 优势（Strengths）

1. **创新的产品概念**：将人生模拟、RPG系统和AI复盘结合，概念新颖
2. **AI技术优势**：利用AI提供个性化路线规划和复盘分析
3. **游戏化体验**：RPG元素增加用户粘性和参与度
4. **开源策略**：本地优先、隐私保护，符合用户对数据安全的关切

#### 劣势（Weaknesses）

1. **市场认知度低**：新产品，用户需要时间了解和接受
2. **技术实现复杂**：AI路线规划和游戏化系统开发难度较高
3. **用户教育成本**：需要教育用户理解产品价值和使用方法
4. **资源有限**：作为新产品，可能面临资源限制

#### 机会（Opportunities）

1. **AI工具市场增长**：用户对AI辅助决策的接受度持续提升
2. **个人成长需求增长**：年轻人对自我提升和人生规划的需求持续增长
3. **竞品能力不足**：现有竞品普遍缺少AI能力和路线规划功能
4. **开源社区支持**：开源策略可以吸引开发者社区贡献

#### 威胁（Threats）

1. **大厂进入风险**：大公司可能推出类似产品
2. **技术变化风险**：AI技术快速迭代，需要持续跟进
3. **用户隐私担忧**：AI应用可能引发用户对隐私的担忧
4. **市场教育难度**：需要教育市场接受新概念和产品形态

---

## 5. 使用场景

### 4.1 重大选择模拟

用户输入：

```text
我应该继续读研，还是直接找工作？
```

系统输出：

- 读研路线
- 就业路线
- 混合路线
- 每条路线的短期收益、长期收益、风险和代价
- 30 天验证计划

### 4.2 长期目标拆解

用户输入：

```text
我想 6 个月内做出 3 个能开源的 AI 产品。
```

系统输出：

- 主线任务
- 每月里程碑
- 每周任务
- 技能树
- 作品集路线

### 4.3 每日任务生成

用户每天打开产品，系统根据当前路线生成：

- 今日主线任务
- 今日支线任务
- 今日最小可行动作
- 今日避免事项

### 4.4 每周复盘

系统根据用户本周任务完成情况生成：

- 本周成长总结
- 属性变化
- 技能树变化
- 路线偏移分析
- 下周建议

### 4.5 人生分支回看

用户可以看到：

```text
如果我继续保持当前行为，3 个月后更接近哪条路线？
```

示例输出：

```text
你原本选择的是产品开发型路线，但最近两周的行为更接近研究型路线。
原因：
- 阅读论文任务完成较多。
- 产品原型任务延迟。
- 开源发布任务未推进。
建议：
- 如果你想回到产品路线，下周至少完成一个可展示 demo。
- 如果你发现自己更喜欢研究路线，可以切换主线。
```

---

## 6. 产品核心循环

### 5.1 主循环

```text
输入目标或困惑
  ↓
生成平行人生路线
  ↓
选择当前主线
  ↓
生成 RPG 任务系统
  ↓
执行每日/每周任务
  ↓
记录反馈
  ↓
系统更新属性、技能和路线
  ↓
每周复盘和路线校准
```

### 5.2 最小日常循环

```text
打开产品
  ↓
查看当前路线
  ↓
领取今日任务
  ↓
完成或跳过任务
  ↓
记录一句反馈
  ↓
获得属性变化
```

### 5.3 每周循环

```text
系统汇总一周行为
  ↓
生成周报
  ↓
更新技能树
  ↓
判断是否偏离主线
  ↓
推荐下周任务
```

### 5.4 每月循环

```text
查看路线进展
  ↓
比较原始模拟与实际行动
  ↓
解锁阶段剧情
  ↓
调整主线目标
  ↓
生成下月里程碑
```

---

## 7. 产品模块

### 6.1 Parallel Me 模块

功能：

- 根据用户目标生成多条人生路线。
- 对每条路线进行收益、代价、风险、能力需求分析。
- 提供短期验证计划。

核心输出：

- 路线标题
- 路线叙事
- 适合人群
- 关键能力
- 主要风险
- 30 天验证计划
- 90 天里程碑
- 一年后可能状态

### 6.2 Life RPG 模块

功能：

- 将路线转化为 RPG 成长系统。
- 生成主线任务、支线任务、每日任务。
- 设计技能树、属性值、成就和等级。

核心输出：

- 当前等级
- 当前主线
- 任务列表
- 技能树
- 属性面板
- 成就系统

### 6.3 Quest Engine 任务引擎

功能：

- 根据路线和用户状态生成任务。
- 控制任务难度。
- 将长期目标拆成短期行动。

任务类型：

- Main Quest：主线任务
- Side Quest：支线任务
- Daily Quest：每日任务
- Recovery Quest：恢复任务
- Social Quest：沟通任务
- Reflection Quest：复盘任务
- Boss Quest：关键挑战任务

### 6.4 Skill Tree 技能树模块

功能：

- 将目标所需能力拆成技能节点。
- 根据任务完成情况更新技能进度。

技能节点示例：

```text
AI 产品开发者
├── 模型调用
├── 前端实现
├── 后端接口
├── 产品设计
├── 开源发布
├── 技术表达
└── 用户反馈
```

### 6.5 Attribute System 属性系统

功能：

- 用属性值表达用户成长倾向。
- 不追求精确科学，而追求反馈可视化。

基础属性：

- Focus：专注力
- Execution：执行力
- Creativity：创造力
- Learning：学习力
- Communication：沟通力
- Resilience：恢复力
- Influence：影响力

### 6.6 Reflection Engine 复盘引擎

功能：

- 每日和每周复盘。
- 从用户反馈中总结行为模式。
- 判断路线偏移。

输出：

- 本周总结
- 关键进展
- 卡点
- 属性变化
- 路线匹配度
- 下周建议

### 6.7 Timeline Map 时间线模块

功能：

- 展示 30 天、90 天、180 天、一年路线。
- 将阶段任务和未来状态可视化。

表现形式：

- 横向时间线
- 分支树
- 地图关卡
- 章节式剧情

### 6.8 Mood / Energy 轻量状态模块

注意：这是 MVP 可选模块，不做复杂心理功能。

功能：

- 用户每天选择能量值。
- 系统根据能量值调整任务数量和难度。

示例：

```text
能量 20%：只给一个最小任务。
能量 60%：给一个主线任务和一个支线任务。
能量 90%：可挑战 Boss Quest。
```

---

## 8. MVP 范围

### 7.1 MVP 目标

第一版只验证：

> 用户输入一个目标后，是否愿意选择一条 AI 生成的人生路线，并开始执行它生成的 7 天任务。

### 7.2 MVP 必做功能

#### 功能 1：用户目标输入

用户填写：

- 当前身份
- 目标
- 困惑
- 时间周期
- 每周可投入时间
- 当前能力基础

示例：

```text
我是一名大三学生。
我想一年内成为 AI 产品开发者。
我纠结要不要考研。
每周可投入 15 小时。
我会一点 Python 和前端。
```

#### 功能 2：生成三条平行路线

系统生成 3 条路线：

- 稳健路线
- 激进路线
- 混合路线

每条路线包含：

- 路线名
- 一句话描述
- 适合人群
- 收益
- 代价
- 风险
- 30 天验证任务
- 90 天里程碑
- 一年后可能状态

#### 功能 3：用户选择当前主线

用户从三条路线中选择一条作为当前主线。

系统保存：

- selectedPathId
- selectedAt
- reason

#### 功能 4：生成 7 天任务地图

MVP 不需要直接生成 90 天详细计划。

只生成：

- 第 1 周主线目标
- 7 天每日任务
- 每天一个最小任务
- 每天一个可选任务
- 周末复盘任务

#### 功能 5：任务完成与反馈

用户可以对任务做：

- 完成
- 跳过
- 延期
- 修改

每个任务允许填写一句反馈。

#### 功能 6：属性面板

MVP 显示基础属性：

- Focus
- Execution
- Learning
- Creativity
- Resilience

任务完成后属性增加。

#### 功能 7：每周复盘

第 7 天后生成：

- 完成率
- 本周成长总结
- 哪个属性提升最多
- 当前路线匹配度
- 下周建议

### 7.3 MVP 暂不做功能

第一版不做：

- 社交系统
- 好友排行榜
- 复杂成就系统
- 移动 App
- 日历深度同步
- 付费系统
- 多设备同步
- 心理诊断
- 长期记忆复杂向量库
- 专业职业咨询结论

---

## 9. 成功指标

### 9.1 核心KPI定义

#### 用户增长指标

1. **新增用户数**：每日/每周/每月新增注册用户
2. **用户增长率**：环比增长率，衡量产品吸引力
3. **用户获取成本（CAC）**：获取一个新用户的成本

#### 用户活跃指标

1. **日活跃用户（DAU）**：每日活跃用户数
2. **月活跃用户（MAU）**：每月活跃用户数
3. **DAU/MAU比率**：衡量用户粘性，目标>20%
4. **用户使用时长**：平均每次使用时长，目标>10分钟

#### 用户留存指标

1. **次日留存率**：新用户次日回访率，目标>40%
2. **7日留存率**：新用户7日内回访率，目标>25%
3. **30日留存率**：新用户30日内回访率，目标>15%
4. **用户流失率**：每月流失用户比例，目标<10%

#### 产品使用指标

1. **路线选择率**：生成路线后选择主线的比例，目标>60%
2. **任务完成率**：用户完成任务的比例，目标>50%
3. **周复盘完成率**：用户完成周复盘的比例，目标>30%
4. **功能使用率**：各核心功能的使用比例

#### 用户满意度指标

1. **净推荐值（NPS）**：用户推荐产品的意愿，目标>30
2. **用户满意度（CSAT）**：用户对产品的满意度，目标>4.0/5.0
3. **用户反馈质量**：用户反馈的积极程度和建设性

### 9.2 数据埋点计划

#### 关键事件定义

**用户生命周期事件**
1. `user_register`：用户注册
2. `user_login`：用户登录
3. `user_onboarding_complete`：完成新手引导

**目标输入事件**
1. `goal_input_start`：开始输入目标
2. `goal_input_complete`：完成目标输入
3. `goal_input_abandon`：放弃目标输入

**路线生成事件**
1. `path_generate_start`：开始生成路线
2. `path_generate_complete`：完成路线生成
3. `path_generate_error`：路线生成失败

**路线选择事件**
1. `path_view`：查看路线详情
2. `path_compare`：对比路线
3. `path_select`：选择主线
4. `path_deselect`：取消选择

**任务系统事件**
1. `quest_view`：查看任务详情
2. `quest_start`：开始任务
3. `quest_complete`：完成任务
4. `quest_skip`：跳过任务
5. `quest_postpone`：延期任务

**复盘系统事件**
1. `review_view`：查看复盘报告
2. `review_complete`：完成复盘
3. `review_share`：分享复盘

**属性系统事件**
1. `attribute_view`：查看属性面板
2. `attribute_change`：属性变化

**技能树事件**
1. `skill_tree_view`：查看技能树
2. `skill_unlock`：解锁技能

#### 埋点位置

**前端埋点**
1. 页面访问：记录用户访问的页面和停留时间
2. 按钮点击：记录用户点击的按钮和操作
3. 表单交互：记录用户填写表单的行为
4. 滚动行为：记录用户滚动页面的行为

**后端埋点**
1. API调用：记录API调用的成功率和响应时间
2. 数据处理：记录数据处理的耗时和结果
3. 错误日志：记录系统错误和异常

#### 数据收集方式

1. **前端埋点**：使用Google Analytics或Mixpanel
2. **后端日志**：使用结构化日志记录
3. **数据库记录**：关键业务数据存储到数据库
4. **用户反馈**：产品内反馈入口和用户访谈

#### 数据分析工具

1. **数据仓库**：使用BigQuery或Snowflake
2. **数据可视化**：使用Tableau或Metabase
3. **A/B测试平台**：使用Optimizely或自建平台
4. **用户行为分析**：使用Amplitude或Mixpanel

### 9.3 A/B测试策略

#### 测试目标

1. **优化用户转化**：提高从访问到注册的转化率
2. **提高用户留存**：提高用户7日和30日留存率
3. **增加功能使用**：提高核心功能的使用率
4. **提升用户满意度**：提高NPS和CSAT

#### 测试变量

**界面设计变量**
1. 按钮颜色和大小
2. 页面布局和排版
3. 引导文案和提示
4. 图标和插图风格

**功能设计变量**
1. 输入表单字段数量
2. 路线展示方式
3. 任务难度设置
4. 复盘报告内容

**算法变量**
1. 路线生成算法
2. 任务推荐算法
3. 属性计算规则
4. 复盘生成逻辑

#### 测试指标

**主要指标**
1. 转化率：从访问到注册、从注册到激活
2. 留存率：次日、7日、30日留存
3. 使用频率：每周使用次数
4. 任务完成率：完成任务的比例

**次要指标**
1. 用户满意度：NPS、CSAT
2. 功能使用率：各功能的使用比例
3. 用户反馈：反馈质量和数量
4. 系统性能：响应时间、错误率

#### 测试流程

1. **假设形成**：基于数据分析和用户反馈形成假设
2. **测试设计**：设计测试方案，确定变量和指标
3. **样本量计算**：计算所需的样本量和测试时长
4. **测试实施**：实施A/B测试，收集数据
5. **结果分析**：分析测试结果，确定胜出方案
6. **方案上线**：将胜出方案上线到所有用户

#### 样本量计算

**计算公式**
```
样本量 = (Zα/2 + Zβ)² × (p1×(1-p1) + p2×(1-p2)) / (p1 - p2)²
```

**参数说明**
- Zα/2：显著性水平对应的Z值（通常为1.96，对应95%置信度）
- Zβ：统计功效对应的Z值（通常为0.84，对应80%统计功效）
- p1：对照组转化率
- p2：实验组预期转化率

**示例计算**
- 对照组转化率：10%
- 实验组预期转化率：12%
- 显著性水平：95%
- 统计功效：80%
- 所需样本量：每组约3,000用户

---

## 10. 用户流程设计

### 8.1 首次使用流程

```text
进入产品首页
  ↓
看到产品定位
  ↓
点击 Start your path
  ↓
填写当前状态和目标
  ↓
AI 生成三条平行人生路线
  ↓
用户查看对比
  ↓
选择一条路线
  ↓
系统生成第一周任务地图
  ↓
用户进入 Dashboard
```

### 8.2 日常使用流程

```text
打开 Dashboard
  ↓
查看当前主线和今日任务
  ↓
选择今日能量值
  ↓
系统调整任务建议
  ↓
用户完成任务
  ↓
填写一句反馈
  ↓
属性变化
```

### 8.3 复盘流程

```text
进入 Weekly Review
  ↓
系统展示本周完成情况
  ↓
AI 生成复盘总结
  ↓
展示路线匹配度
  ↓
用户确认是否继续当前路线
  ↓
生成下周任务
```

### 8.4 重新模拟流程

用户可以在以下场景重新模拟：

- 当前路线不适合。
- 新增目标。
- 现实条件发生变化。
- 连续两周任务失败。

流程：

```text
点击 Re-simulate
  ↓
填写变化原因
  ↓
AI 基于历史反馈生成新路线
  ↓
用户选择保留或切换主线
```

---

## 10. 页面设计

### 9.1 Landing Page

目标：

- 让用户理解产品不是普通 Todo。
- 让用户愿意输入目标。

页面模块：

1. Hero
   - 标题：Simulate your possible futures. Turn one into quests.
   - 副标题：PathForge helps you explore life paths, choose one, and build it through RPG-style quests.
   - CTA：Start your path

2. 输入示例
   - “我想一年内成为 AI 产品开发者，但纠结要不要考研。”
   - “我想半年内做出第一个开源产品。”
   - “我想转行，但不知道走技术还是产品。”

3. 产品三步
   - Simulate paths
   - Choose a main quest
   - Level up weekly

4. 结果预览
   - 平行路线卡片
   - 任务地图
   - 技能树

5. 安全说明
   - This is a reflection tool, not a destiny machine.

### 9.2 Onboarding Page

字段：

- 当前身份
- 当前阶段
- 长期目标
- 当前困惑
- 时间周期
- 每周可投入时间
- 现有能力
- 不想牺牲什么

示例表单：

```json
{
  "identity": "大三学生",
  "goal": "一年内成为 AI 产品开发者",
  "dilemma": "纠结考研还是就业",
  "timeHorizon": "12 months",
  "weeklyHours": 15,
  "currentSkills": ["Python basic", "frontend basic"],
  "constraints": ["不想完全放弃学业", "预算有限"]
}
```

### 9.3 Parallel Paths Page

页面目标：

- 展示 3 条路线。
- 帮助用户比较。
- 引导用户选择主线。

卡片内容：

- 路线名称
- 路线标签
- 一句话未来
- 收益
- 代价
- 风险
- 适合你如果
- 30 天验证
- 选择按钮

对比视图：

```text
路线        稳定性    成长速度    风险    作品产出    学术深度
研究型      高        中          低      低          高
产品型      中        高          中      高          中
混合型      中        中          中      中          中
```

### 9.4 Dashboard

页面模块：

- 当前角色卡
- 当前主线
- 今日任务
- 属性面板
- 技能树摘要
- 7 天任务地图
- 本周进度

布局：

```text
左侧：当前路线和任务
右侧：属性、技能树、时间线
底部：反馈和复盘入口
```

### 9.5 Quest Detail Page

显示：

- 任务标题
- 任务类型
- 任务难度
- 预计时间
- 为什么做这个任务
- 完成标准
- 可降级版本
- 可升级版本

示例：

```text
任务：发布第一个项目 README 草稿
类型：Main Quest
预计时间：60 分钟
为什么：你的产品路线需要形成公开表达能力。
完成标准：GitHub 仓库中存在 README.md，包含定位、安装、使用方式。
降级版本：只写项目定位和功能列表。
升级版本：增加截图和 Roadmap。
```

### 9.6 Weekly Review Page

模块：

- 本周完成率
- 完成的主线任务
- 跳过的任务
- 属性变化
- 技能树变化
- AI 复盘
- 路线匹配度
- 下周建议

路线匹配度示例：

```text
当前行为与产品开发型路线匹配度：72%
当前行为与研究型路线匹配度：58%
当前行为与内容影响力路线匹配度：35%
```

### 9.7 Timeline Page

展示：

- 30 天
- 90 天
- 180 天
- 365 天

每个节点包括：

- 阶段目标
- 关键任务
- 预期能力
- 可能风险
- 复盘问题

---

## 11. 核心数据结构

### 10.1 UserProfile

```json
{
  "id": "user_001",
  "displayName": "Alex",
  "identity": "大三学生",
  "currentStage": "college",
  "goals": [],
  "constraints": [],
  "preferences": {
    "language": "zh-CN",
    "tone": "supportive",
    "taskIntensity": "medium"
  },
  "createdAt": "2026-06-17T00:00:00.000Z"
}
```

### 10.2 LifeGoal

```json
{
  "id": "goal_001",
  "title": "一年内成为 AI 产品开发者",
  "description": "希望能独立设计并开发 AI 产品",
  "timeHorizon": "12 months",
  "weeklyHours": 15,
  "motivation": "建立作品集并获得职业机会",
  "constraints": ["学业不能完全放弃", "预算有限"],
  "createdAt": "2026-06-17T00:00:00.000Z"
}
```

### 10.3 ParallelPath

```json
{
  "id": "path_001",
  "goalId": "goal_001",
  "name": "产品开发型路线",
  "archetype": "builder",
  "summary": "通过连续开源项目建立作品集和产品能力。",
  "futureSnapshot": "一年后，你拥有 3 个可展示 AI 产品和一个清晰的个人主页。",
  "suitableFor": ["喜欢动手做项目", "希望用作品证明能力"],
  "benefits": ["作品产出快", "反馈周期短", "更适合找实习或远程机会"],
  "costs": ["需要持续执行", "早期作品质量可能不稳定"],
  "risks": ["容易做太多半成品", "技术深度可能不足"],
  "requiredSkills": ["前端", "后端", "模型 API", "产品设计", "开源发布"],
  "thirtyDayValidation": [],
  "ninetyDayMilestones": [],
  "oneYearOutcome": "",
  "createdAt": "2026-06-17T00:00:00.000Z"
}
```

### 10.4 SelectedPath

```json
{
  "id": "selected_001",
  "userId": "user_001",
  "goalId": "goal_001",
  "pathId": "path_001",
  "selectedAt": "2026-06-17T00:00:00.000Z",
  "reason": "我希望通过作品获得更快反馈。",
  "status": "active"
}
```

### 10.5 Quest

```json
{
  "id": "quest_001",
  "pathId": "path_001",
  "title": "完成第一个 AI 工具的产品定位文档",
  "type": "main",
  "difficulty": 2,
  "estimatedMinutes": 60,
  "description": "为你的第一个 AI 产品定义目标用户、痛点和 MVP。",
  "whyItMatters": "产品开发型路线需要先形成清晰的产品判断。",
  "acceptanceCriteria": [
    "写出目标用户",
    "写出核心痛点",
    "写出 MVP 功能列表"
  ],
  "attributes": {
    "execution": 2,
    "creativity": 1,
    "learning": 1
  },
  "skillImpacts": [
    {
      "skillId": "product_design",
      "delta": 5
    }
  ],
  "status": "pending",
  "dueDate": "2026-06-18"
}
```

### 10.6 QuestLog

```json
{
  "id": "log_001",
  "questId": "quest_001",
  "userId": "user_001",
  "status": "completed",
  "completedAt": "2026-06-18T00:00:00.000Z",
  "reflection": "写完后发现目标用户还不够具体。",
  "actualMinutes": 75,
  "energyLevel": 60
}
```

### 10.7 AttributeProfile

```json
{
  "userId": "user_001",
  "focus": 12,
  "execution": 18,
  "learning": 15,
  "creativity": 10,
  "communication": 8,
  "resilience": 11,
  "influence": 5,
  "updatedAt": "2026-06-17T00:00:00.000Z"
}
```

### 10.8 SkillTree

```json
{
  "id": "skilltree_001",
  "goalId": "goal_001",
  "name": "AI 产品开发者技能树",
  "skills": [
    {
      "id": "product_design",
      "name": "产品设计",
      "level": 1,
      "progress": 20,
      "children": ["user_research", "mvp_design"]
    },
    {
      "id": "frontend",
      "name": "前端实现",
      "level": 1,
      "progress": 10,
      "children": ["ui_layout", "state_management"]
    }
  ]
}
```

### 10.9 WeeklyReview

```json
{
  "id": "review_001",
  "userId": "user_001",
  "goalId": "goal_001",
  "weekStart": "2026-06-17",
  "weekEnd": "2026-06-23",
  "completionRate": 0.71,
  "completedQuests": 5,
  "skippedQuests": 2,
  "summary": "本周你在产品定位和执行力上有明显推进。",
  "attributeChanges": {
    "execution": 5,
    "learning": 3
  },
  "pathAlignment": [
    {
      "pathId": "path_001",
      "score": 72
    },
    {
      "pathId": "path_002",
      "score": 58
    }
  ],
  "recommendations": []
}
```

---

## 12. AI 生成流程

### 11.1 总体 Pipeline

```text
User Input
  ↓
Goal Understanding
  ↓
Parallel Path Generation
  ↓
Path Comparison
  ↓
User Selection
  ↓
RPG System Generation
  ↓
Weekly Quest Planning
  ↓
Daily Adaptation
  ↓
Reflection and Replanning
```

### 11.2 Goal Understanding

输入：

- 当前身份
- 目标
- 困惑
- 时间周期
- 可投入时间
- 约束

输出：

```json
{
  "goalType": "career_growth",
  "timeHorizon": "12 months",
  "mainTension": "考研 vs 产品实践",
  "constraints": [],
  "successSignals": [],
  "riskFactors": []
}
```

### 11.3 Parallel Path Generation

生成 3 条路线：

1. Conservative Path：稳健路线
2. Aggressive Path：激进路线
3. Hybrid Path：混合路线

每条路线必须包含：

- 路线名
- 未来快照
- 适合条件
- 收益
- 成本
- 风险
- 30 天验证任务
- 90 天里程碑
- 一年后可能状态

### 11.4 RPG System Generation

用户选择路线后，生成：

- 角色标题
- 当前等级
- 主线任务
- 支线任务
- 技能树
- 属性初始值
- 第一周任务地图

### 11.5 Quest Generation

任务生成原则：

- 每个任务必须可执行。
- 每个任务必须有完成标准。
- 每个任务必须解释为什么重要。
- 每个任务必须可降级。
- 每天任务数量不要超过 3 个。

任务难度：

```text
1：10 到 20 分钟
2：30 到 60 分钟
3：1 到 2 小时
4：半天
5：关键挑战，需要多天
```

### 11.6 Reflection Generation

复盘生成依据：

- 完成任务数量
- 跳过任务数量
- 用户反馈文本
- 能量值
- 属性变化
- 路线目标

输出：

- 客观总结
- 行为模式
- 鼓励性反馈
- 风险提醒
- 下周建议

注意：

复盘语气必须避免说教。

---

## 13. Prompt 设计

### 12.1 System Prompt

```text
You are an expert product coach, career strategist, and RPG systems designer.
Your job is to help the user simulate possible life paths and convert one selected path into practical quests.

Rules:
1. Do not claim to predict the future.
2. Present paths as simulations, not destiny.
3. Make tasks concrete and executable.
4. Avoid medical, legal, or financial certainty.
5. Avoid manipulative pressure.
6. Respect user constraints.
7. Always include tradeoffs and risks.
8. Output strict JSON only when asked for structured output.
```

### 12.2 平行路线生成 Prompt

```text
The user is trying to make a life or career decision.
Generate three plausible paths:
1. Conservative path
2. Aggressive path
3. Hybrid path

User profile:
{user_profile}

Goal:
{goal}

Constraints:
{constraints}

For each path, include:
- name
- archetype
- one sentence summary
- future snapshot
- suitable_for
- benefits
- costs
- risks
- required_skills
- 30_day_validation
- 90_day_milestones
- one_year_possible_outcome

Important:
- Do not overpromise.
- Do not predict with certainty.
- Make each path meaningfully different.
- Use practical language.
```

### 12.3 RPG 任务生成 Prompt

```text
The user selected this life path:
{selected_path}

Generate a 7-day RPG quest map.

Requirements:
- Each day has 1 main quest and 1 optional side quest.
- Each quest must be concrete.
- Each quest must include acceptance criteria.
- Each quest must include estimated minutes.
- Each quest must include a lower-difficulty fallback.
- The plan must respect the user's weekly available hours.

Output strict JSON with:
- character_title
- main_quest
- attributes
- skill_tree
- daily_quests
- weekly_boss_quest
- weekly_review_prompt
```

### 12.4 每周复盘 Prompt

```text
Generate a weekly review for the user.

Inputs:
User goal:
{goal}

Selected path:
{selected_path}

Quest logs:
{quest_logs}

User reflections:
{reflections}

Output:
- objective_summary
- completed_highlights
- blockers
- attribute_changes
- path_alignment
- suggested_adjustments
- next_week_focus

Tone:
Warm, honest, practical. Do not shame the user.
```

---

## 14. 规则系统设计

### 13.1 任务生成规则

任务必须满足：

- 具体：不能是“提升编程能力”。
- 可验证：必须知道什么时候算完成。
- 有时间：必须估计耗时。
- 有意义：必须解释与路线的关系。
- 可降级：用户低能量时也能做一个最小版本。

错误示例：

```text
学习前端。
```

正确示例：

```text
用 45 分钟完成一个 React 页面组件，并提交到 GitHub。完成标准：页面能显示标题、按钮和一个输入框。
```

### 13.2 路线生成规则

每条路线必须有明显差异。

错误示例：

```text
路线 A：努力学习。
路线 B：更加努力学习。
路线 C：平衡学习。
```

正确示例：

```text
路线 A：研究深度优先。
路线 B：作品集产出优先。
路线 C：研究与产品双轨验证。
```

### 13.3 属性增长规则

属性增长不应过于复杂。

MVP 可采用固定规则：

```text
完成难度 1 任务：相关属性 +1
完成难度 2 任务：相关属性 +2
完成难度 3 任务：相关属性 +3
完成 Boss Quest：相关属性 +5
跳过任务：不扣分
连续完成 3 天：Execution +2
完成复盘：Resilience +1
```

不建议失败扣分，因为容易制造压力。

### 13.4 路线匹配度规则

路线匹配度可由以下因素计算：

- 完成的任务属于哪条路线。
- 用户反馈中的兴趣倾向。
- 技能树增长方向。
- 时间投入分布。

MVP 简化算法：

```text
pathAlignment = completedPathRelatedQuests / totalCompletedQuests * 100
```

后续可加入 LLM 判断。

---

## 15. 技术架构

### 14.1 推荐技术栈

前端：

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

后端：

- Next.js API Routes 或 FastAPI
- Prisma
- SQLite for MVP
- PostgreSQL for production

AI：

- OpenAI-compatible API
- 支持自定义 base URL
- 支持模型切换

认证：

- MVP 可不做账号系统
- 使用 localStorage 或本地 SQLite
- 后续接入 Auth.js

状态管理：

- Zustand
- React Query

可视化：

- React Flow 用于路线图和技能树
- Recharts 用于属性变化

### 14.2 MVP 架构

MVP 建议做成本地优先 Web App。

```text
Browser
  ↓
Next.js App
  ↓
API Route
  ↓
LLM Provider
  ↓
SQLite / localStorage
```

更快的最小版本：

```text
Browser only
  ↓
LLM API
  ↓
localStorage
```

如果要开源传播，建议：

- 默认本地存储。
- 用户自己配置 API Key。
- 不强依赖云服务。

### 14.3 Monorepo 结构

```text
pathforge/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── styles/
├── packages/
│   ├── core/
│   │   ├── path-generation.ts
│   │   ├── quest-generation.ts
│   │   ├── review-generation.ts
│   │   ├── attribute-engine.ts
│   │   └── alignment-engine.ts
│   ├── schemas/
│   │   ├── user.ts
│   │   ├── goal.ts
│   │   ├── path.ts
│   │   ├── quest.ts
│   │   └── review.ts
│   ├── prompts/
│   │   ├── generate-paths.ts
│   │   ├── generate-quests.ts
│   │   └── generate-review.ts
│   └── ui/
├── docs/
├── examples/
├── package.json
└── README.md
```

---

## 16. 数据库设计

### 15.1 users

字段：

- id
- display_name
- identity
- current_stage
- preferences_json
- created_at
- updated_at

### 15.2 goals

字段：

- id
- user_id
- title
- description
- time_horizon
- weekly_hours
- motivation
- constraints_json
- status
- created_at
- updated_at

### 15.3 paths

字段：

- id
- goal_id
- name
- archetype
- summary
- future_snapshot
- suitable_for_json
- benefits_json
- costs_json
- risks_json
- required_skills_json
- thirty_day_validation_json
- ninety_day_milestones_json
- one_year_outcome
- created_at

### 15.4 selected_paths

字段：

- id
- user_id
- goal_id
- path_id
- reason
- status
- selected_at

### 15.5 quests

字段：

- id
- path_id
- goal_id
- title
- type
- difficulty
- estimated_minutes
- description
- why_it_matters
- acceptance_criteria_json
- fallback_json
- attributes_json
- skill_impacts_json
- status
- due_date
- created_at
- updated_at

### 15.6 quest_logs

字段：

- id
- quest_id
- user_id
- status
- reflection
- actual_minutes
- energy_level
- completed_at
- created_at

### 15.7 attribute_profiles

字段：

- id
- user_id
- focus
- execution
- learning
- creativity
- communication
- resilience
- influence
- updated_at

### 15.8 skill_trees

字段：

- id
- goal_id
- name
- skills_json
- created_at
- updated_at

### 15.9 weekly_reviews

字段：

- id
- user_id
- goal_id
- week_start
- week_end
- completion_rate
- completed_quests
- skipped_quests
- summary
- attribute_changes_json
- path_alignment_json
- recommendations_json
- created_at

---

## 17. API 设计

### 16.1 POST /api/goals

创建目标。

请求：

```json
{
  "identity": "大三学生",
  "goal": "一年内成为 AI 产品开发者",
  "dilemma": "纠结考研还是就业",
  "timeHorizon": "12 months",
  "weeklyHours": 15,
  "currentSkills": ["Python basic", "frontend basic"],
  "constraints": ["不想完全放弃学业"]
}
```

响应：

```json
{
  "goalId": "goal_001"
}
```

### 16.2 POST /api/paths/generate

生成平行路线。

请求：

```json
{
  "goalId": "goal_001"
}
```

响应：

```json
{
  "paths": []
}
```

### 16.3 POST /api/paths/select

选择路线。

请求：

```json
{
  "goalId": "goal_001",
  "pathId": "path_001",
  "reason": "我想通过作品获得快速反馈"
}
```

响应：

```json
{
  "selectedPathId": "selected_001"
}
```

### 16.4 POST /api/quests/generate-week

生成第一周任务。

请求：

```json
{
  "selectedPathId": "selected_001",
  "weekStart": "2026-06-17"
}
```

响应：

```json
{
  "quests": []
}
```

### 16.5 PATCH /api/quests/:id

更新任务状态。

请求：

```json
{
  "status": "completed",
  "reflection": "这个任务比想象中难，但我完成了初稿。",
  "actualMinutes": 75,
  "energyLevel": 60
}
```

响应：

```json
{
  "questLogId": "log_001",
  "attributeChanges": {}
}
```

### 16.6 POST /api/reviews/weekly

生成周复盘。

请求：

```json
{
  "goalId": "goal_001",
  "weekStart": "2026-06-17",
  "weekEnd": "2026-06-23"
}
```

响应：

```json
{
  "review": {}
}
```

---

## 18. 前端组件设计

### 17.1 GoalInputForm

职责：

- 收集用户目标和约束。
- 做基础校验。
- 提交生成路线。

字段：

- identity
- goal
- dilemma
- timeHorizon
- weeklyHours
- currentSkills
- constraints

### 17.2 PathCard

职责：

- 展示一条平行路线。

Props：

```ts
type PathCardProps = {
  path: ParallelPath
  selected?: boolean
  onSelect: (pathId: string) => void
}
```

### 17.3 PathComparisonTable

职责：

- 横向对比多条路线。

维度：

- 稳定性
- 成长速度
- 风险
- 作品产出
- 学术深度
- 现金流压力
- 时间要求

### 17.4 QuestCard

职责：

- 展示任务。
- 支持完成、跳过、延期。

字段：

- title
- type
- difficulty
- estimatedMinutes
- dueDate
- status

### 17.5 AttributePanel

职责：

- 展示属性值。
- 展示最近变化。

### 17.6 SkillTreeView

职责：

- 展示技能树。
- MVP 可先用列表，后续用 React Flow。

### 17.7 WeeklyReviewPanel

职责：

- 展示周复盘。
- 展示路线匹配度。

### 17.8 TimelineMap

职责：

- 展示阶段目标。
- MVP 可先用竖向时间线。

---

## 19. 视觉设计方向

### 18.1 整体风格

关键词：

- 未来感
- 个人成长
- 游戏化但不幼稚
- 温和
- 有路线感
- 有地图感

避免：

- 过度像手游。
- 过度卡通。
- 过度赛博朋克。
- 过度焦虑的排行榜。

### 18.2 UI 主题

推荐主题：

```text
背景：#F8FAFC
主色：#6366F1
辅助色：#22C55E
强调色：#F59E0B
文字：#111827
次级文字：#6B7280
边框：#E5E7EB
```

### 18.3 核心视觉元素

- 路线分支图
- 任务地图
- 角色属性面板
- 技能树
- 周复盘卡片
- 阶段里程碑

### 18.4 第一屏设计

首页第一屏应展示：

- 左侧：产品主张和输入入口
- 右侧：动态分支路线预览

示例结构：

```text
Simulate your possible futures.
Choose one.
Turn it into quests.

[ Start your path ]

右侧：
当前的我
├── Research Path
├── Builder Path
└── Hybrid Path
```

---

## 20. 安全与伦理边界

### 19.1 不做确定性预测

所有路线都必须表达为：

- 可能
- 模拟
- 倾向
- 路线假设

禁止表达：

- 你一定会
- 最正确选择是
- 你的命运是

### 19.2 不做专业替代

对于以下领域，必须提示用户寻求专业帮助：

- 严重心理危机
- 法律决策
- 医疗决策
- 高风险财务决策

### 19.3 不制造羞耻感

任务失败时不扣属性，不羞辱用户。

推荐表达：

```text
这个任务没有完成，说明它可能太大、时机不合适，或者需要拆得更小。
```

避免表达：

```text
你又失败了。
你的执行力下降了。
```

### 19.4 保护隐私

用户会输入很个人的目标和困惑。

产品应支持：

- 本地优先存储。
- 导出数据。
- 删除全部数据。
- 不默认公开分享。

---

## 21. MVP 开发路线图

### 20.1 V0.1：单机可用原型

目标：

- 用户输入目标。
- AI 生成三条路线。
- 用户选择路线。
- AI 生成 7 天任务。
- 用户可以完成任务。

功能：

- Landing Page
- GoalInputForm
- ParallelPathsPage
- Dashboard
- QuestCard
- localStorage 保存
- LLM 生成路线和任务

验收：

- 端到端流程可跑通。
- 不需要登录。
- 页面体验完整。

### 20.2 V0.2：数据结构稳定版

目标：

- 增加数据库。
- 支持多目标。
- 支持周复盘。

功能：

- SQLite / Prisma
- Weekly Review
- Attribute Engine
- Skill Tree 简版
- 路线匹配度

验收：

- 用户可以连续使用 7 天。
- 周复盘能基于真实任务记录生成。

### 20.3 V0.3：开源发布版

目标：

- 项目可部署。
- 文档完整。
- 有 demo 数据。

功能：

- Docker 部署
- 环境变量配置
- OpenAI-compatible API
- 示例用户模板
- README
- 贡献指南

验收：

- 新用户 10 分钟内本地跑起来。
- 示例流程清晰。

### 20.4 V1.0：产品化版本

目标：

- 可长期使用。
- 支持真实用户数据。

功能：

- 账号系统
- 云端同步
- 多路线切换
- 多模板
- 日历集成
- 数据导出
- 更完整技能树

---

## 22. 第一周开发计划

### Day 1：项目初始化

任务：

- 创建 Next.js 项目。
- 安装 Tailwind、shadcn/ui、zod。
- 定义核心 schema。
- 设计基础页面路由。

产出：

- 项目骨架。
- 类型定义。
- 基础首页。

### Day 2：目标输入与路线生成

任务：

- 实现 GoalInputForm。
- 编写路线生成 prompt。
- 接入 LLM API。
- 输出 3 条 ParallelPath。

产出：

- 输入目标后能生成路线。

### Day 3：路线对比与选择

任务：

- 实现 PathCard。
- 实现 PathComparisonTable。
- 支持选择路线。
- 保存 selectedPath。

产出：

- 用户能选择主线。

### Day 4：任务生成

任务：

- 编写任务生成 prompt。
- 根据 selectedPath 生成 7 天任务。
- 实现 QuestCard。

产出：

- 用户能看到第一周任务地图。

### Day 5：Dashboard 和任务状态

任务：

- 实现 Dashboard。
- 支持任务完成、跳过、延期。
- 保存 QuestLog。
- 实现属性变化。

产出：

- 用户可执行任务并看到属性变化。

### Day 6：周复盘

任务：

- 实现 Weekly Review prompt。
- 汇总 QuestLog。
- 生成周复盘。
- 展示路线匹配度。

产出：

- 可生成第一版复盘。

### Day 7：打磨与开源准备

任务：

- 增加示例数据。
- 补充 README。
- 增加部署说明。
- 修复 UI 细节。
- 准备 demo 截图。

产出：

- 可开源的 MVP。

---

## 23. 验收标准

### 22.1 功能验收

MVP 必须满足：

- 用户可以输入目标。
- 系统可以生成 3 条路线。
- 用户可以选择路线。
- 系统可以生成 7 天任务。
- 用户可以更新任务状态。
- 系统可以展示属性变化。
- 系统可以生成周复盘。

### 22.2 内容质量验收

测试 10 个目标输入：

```text
我想半年内做出一个 AI 产品。
我想转行做程序员。
我想准备考研但又想做项目。
我想建立个人品牌。
我想提升英语。
我想从后端转 AI 工程。
我想做自由职业。
我想一年内找到远程工作。
我想养成写作习惯。
我想做一个开源项目。
```

验收标准：

- 每个目标生成的 3 条路线有明显差异。
- 每条路线有收益和代价。
- 任务具体可执行。
- 不出现确定性人生预测。
- 不出现明显空泛建议。

### 22.3 用户体验验收

目标：

- 首次生成路线时间低于 60 秒。
- 任务生成时间低于 40 秒。
- 用户在 5 分钟内理解产品玩法。
- 用户能在 10 分钟内完成第一次路线选择。

---

## 24. 开源策略

### 23.1 README 标语

```text
PathForge: Simulate your possible futures. Choose one. Turn it into quests.
```

### 23.2 README 结构

```text
# PathForge

Simulate your possible futures. Choose one. Turn it into quests.

## Why
## Demo
## Features
## How It Works
## Quickstart
## Configuration
## Roadmap
## Privacy
## Contributing
## License
```

### 23.3 Demo 场景

建议准备 3 个 demo：

1. 大学生：考研 vs 就业 vs 产品作品集
2. 开发者：后端转 AI 工程
3. 创作者：建立个人品牌

### 23.4 GitHub Topics

```text
ai
life-planning
productivity
rpg
personal-growth
llm
nextjs
self-hosted
open-source
```

### 23.5 传播角度

不要说：

```text
又一个 AI Todo App。
```

要说：

```text
An open-source life simulator that turns your possible futures into quests.
```

---

## 25. 商业化可能性

虽然第一阶段开源，但长期可以有商业化方向。

### 24.1 免费开源版

功能：

- 本地使用
- 单用户
- 自带 API Key
- 基础路线生成
- 基础任务系统

### 24.2 Pro 版

功能：

- 云端同步
- 多设备
- 长期记忆
- 日历集成
- 高级复盘
- 多目标管理

### 24.3 Team / Coach 版

功能：

- 教练和学生协作
- 导师查看进展
- 团队成长路线
- 训练营任务地图

注意：

商业化不应破坏本地优先和隐私原则。

---

## 26. 未来扩展方向

### 25.1 Mood OS 融合

将每日能量和情绪状态接入任务系统。

能力：

- 低能量日自动降级任务。
- 高能量日推荐挑战任务。
- 焦虑状态下减少任务数量。

### 25.2 Memory Museum 融合

将用户的重要成长记录变成人生档案馆。

能力：

- 关键节点回看。
- 成长展厅。
- 里程碑故事。

### 25.3 Calendar Integration

将任务同步到日历。

能力：

- Google Calendar
- Notion Calendar
- Apple Calendar

### 25.4 Social Sharing

允许用户分享：

- 路线卡片
- 7 天任务地图
- 周复盘卡片

注意：

分享必须默认隐藏隐私信息。

### 25.5 Agent Mode

让 AI 不只是生成计划，而是主动提醒和调整。

能力：

- 每周自动复盘。
- 任务失败后自动拆小。
- 路线偏移后提示重新选择。

---

## 27. 编程 Agent 执行提示词

可以将以下提示词交给编程 Agent：

```text
你是一名资深全栈工程师和产品工程师。请根据 life-rpg-parallel-me-product-dev-doc.md 开发 PathForge 的 MVP。

产品目标：
实现一个 AI 驱动的人生路线模拟与 RPG 任务系统。用户输入一个长期目标或人生困惑，系统生成三条平行路线，用户选择一条作为主线后，系统生成 7 天任务地图，并允许用户完成任务、更新属性、生成周复盘。

技术栈建议：
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- zod
- localStorage 或 SQLite
- OpenAI-compatible API

优先级：
1. 搭建 Next.js 项目。
2. 定义 UserProfile、LifeGoal、ParallelPath、Quest、QuestLog、AttributeProfile、WeeklyReview 的 zod schema。
3. 实现目标输入页。
4. 实现三条路线生成。
5. 实现路线对比页。
6. 实现路线选择。
7. 实现 7 天任务地图生成。
8. 实现 Dashboard。
9. 实现任务完成、跳过、延期。
10. 实现属性变化。
11. 实现周复盘。

MVP 约束：
- 不做账号系统。
- 不做付费。
- 不做复杂社交。
- 不做心理诊断。
- 不做确定性人生预测。
- 所有 AI 输出都必须强调路线只是模拟，不是命运预测。

验收标准：
- 用户能完成从输入目标到选择路线再到生成任务的完整流程。
- 每条路线必须有收益、代价和风险。
- 每个任务必须有完成标准和预计时间。
- 任务失败不扣分。
- 周复盘语气温和、具体、可执行。
```

---

## 28. 最小可行版本总结

最小版本只需要跑通：

```text
目标输入
  ↓
三条路线
  ↓
选择路线
  ↓
7 天任务
  ↓
任务完成
  ↓
属性变化
  ↓
周复盘
```

第一版成功的关键不是功能多，而是用户看到三条路线时产生：

> 原来我的人生选择可以这样被拆开比较。

用户看到任务地图时产生：

> 这不是空泛建议，我今天就能做第一步。

如果这两个反应成立，PathForge 就值得继续做。

