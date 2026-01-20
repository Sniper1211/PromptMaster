# 实现“每小时随机排序”的分页加载

## 1. 后端开发：随机分页接口 (`api/prompts.js`)
- **核心算法**：使用“时间种子哈希”实现稳定的伪随机排序。
  - 生成种子：`hourKey = YYYYMMDDHH` (当前小时)。
  - SQL 排序：`ORDER BY md5(id::text || '${hourKey}') ASC`。
  - 效果：同一小时内顺序固定（支持分页），跨小时顺序重排（实现随机）。
- **分页参数**：接收 `page` (默认 1) 和 `limit` (默认 24)。
- **返回数据**：`{ prompts: [], hasMore: boolean }`。

## 2. 前端开发：重构数据层 (`usePrompts.ts`)
- **废弃本地全量加载**：转为纯 API 分页模式，减轻首屏压力。
- **状态管理**：
  - `prompts`: 动态追加的数组。
  - `page`: 当前页码。
  - `isLoadingMore`: 加载更多时的状态。
- **功能函数**：`loadMore()` 用于请求下一页并合并数据。

## 3. 前端开发：首页交互 (`HomePage.tsx`)
- **自动加载触发器**：
  - 在列表底部添加一个 "Load More" 锚点元素。
  - 使用 `IntersectionObserver` 监听该元素：当用户滚动到底部时，自动触发 `loadMore()`。
- **UI 反馈**：
  - 底部显示 Loading 动画。
  - 数据加载完毕显示 "THE END" 风格提示。

## 4. 执行步骤
- 修改后端 API 实现哈希排序。
- 重构前端 Hook。
- 实现首页自动滚动加载。
