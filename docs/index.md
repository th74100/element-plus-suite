---
layout: home

hero:
  name: Element Plus Suite
  text: 少写一点表格代码，多留一点时间给业务
  tagline: 在保留 ElTable 全部能力的基础上，提供列配置、分页和远程请求的统一入口。
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/quick-start
    - theme: alt
      text: 认识 ElTablePro
      link: /components/table-pro/

features:
  - title: 仍然是熟悉的 ElTable
    details: 原生属性、事件和实例方法都保留。已经掌握的 Element Plus 用法，不需要重新学一遍。
  - title: 列配置更集中
    details: 用一份 columns 配置定义表头、列宽、插槽和分组列，页面结构会清爽很多。
  - title: 分页不必重复写
    details: 不传 pagination 时自动启用默认分页；传入 pagination=false 即可关闭。
  - title: 请求逻辑交给页面
    details: request 只负责返回 data 和 total。排序、筛选、查询条件仍由业务页面控制。
  - title: 类型覆盖完整
    details: Columns、请求参数、事件载荷和实例方法都有 TypeScript 类型提示。
  - title: 体积不会翻倍
    details: element-plus 作为 peer dependency，不会被组件库重复打包。
---

<section class="home-section">
  <p class="home-eyebrow">为什么需要它</p>
  <h2>表格能力不缩水，重复代码少一点</h2>
  <p class="home-intro">ElTable 已经足够强大，真正麻烦的是每个页面都要重复写列、分页和请求状态。ElTablePro 把这些重复工作收进组件，同时不接管你的业务决策。</p>

  <div class="home-cards">
    <article>
      <span class="home-card__number">01</span>
      <h3>配置驱动</h3>
      <p>columns 描述列，模板只保留真正需要定制的单元格插槽。</p>
    </article>
    <article>
      <span class="home-card__number">02</span>
      <h3>边界清楚</h3>
      <p>请求如何发、何时重新加载、排序和筛选条件怎么组合，都由页面决定。</p>
    </article>
    <article>
      <span class="home-card__number">03</span>
      <h3>逐步采用</h3>
      <p>可以从本地数据开始，也可以只使用列配置，不必一次接管整张表。</p>
    </article>
  </div>
</section>

<section class="home-section home-section--contrast">
  <p class="home-eyebrow">一个请求就够了</p>
  <h2>接口格式不同，适配放在 request 里</h2>
  <p class="home-intro">不管后端返回 data.list、rows 还是嵌套结构，只要在 request 中整理成统一结果，表格就不必关心接口细节。</p>

```ts
const requestUsers: TableProRequest<User> = async ({ page, pageSize, signal }) => {
  const response = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`, { signal })
  const payload = await response.json()

  return {
    data: payload.data.list,
    total: payload.data.count,
  }
}
```

  <div class="home-points">
    <span>✓ 使用 fetch、axios 或项目自己的请求封装</span>
    <span>✓ 自动取消上一次未完成的请求</span>
    <span>✓ 返回值只需包含 data 和 total</span>
  </div>
</section>

<section class="home-section home-section--cta">
  <h2>从一张普通表格开始</h2>
  <p>先看看只需要 columns 和 data 时，组件可以简洁到什么程度。</p>
  <a class="home-cta" href="/guide/quick-start">阅读快速开始 <span>→</span></a>
</section>
