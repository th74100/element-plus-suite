<template>
  <div class="demo-toolbar">
    <ElInput v-model="keyword" placeholder="搜索成员或角色" clearable @keyup.enter="search" />
    <ElButton type="primary" @click="search">查询</ElButton>
  </div>

  <ElTablePro
    ref="tableRef"
    :columns="columns"
    :request="requestMembers"
    :pagination="{ pageSize: 10 }"
    @loaded="lastLoadedAt = new Date().toLocaleTimeString()"
  />

  <p class="demo-note">最近一次响应时间：{{ lastLoadedAt }}</p>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { ElTablePro, type TableProColumn, type TableProInstance, type TableProRequest } from 'element-plus-suite'

interface Member {
  id: number
  name: string
  role: string
}

const allMembers: Member[] = [
  { id: 1, name: '林晓', role: '产品设计' },
  { id: 2, name: '陈默', role: '前端开发' },
  { id: 3, name: '周宁', role: '数据分析' },
  { id: 4, name: '苏禾', role: '品牌运营' },
  { id: 5, name: '顾远', role: '后端开发' },
  { id: 6, name: '梁秋', role: '客户成功' },
  { id: 7, name: '许言', role: '产品设计' },
  { id: 8, name: '沈川', role: '前端开发' },
  { id: 9, name: '宋岚', role: '数据分析' },
  { id: 10, name: '陆遥', role: '品牌运营' },
  { id: 11, name: '唐越', role: '后端开发' },
  { id: 12, name: '何嘉', role: '客户成功' },
  { id: 13, name: '乔安', role: '产品设计' },
  { id: 14, name: '方舟', role: '前端开发' },
  { id: 15, name: '叶青', role: '数据分析' },
  { id: 16, name: '江澄', role: '品牌运营' },
  { id: 17, name: '韩松', role: '后端开发' },
  { id: 18, name: '温宁', role: '客户成功' },
  { id: 19, name: '白露', role: '产品设计' },
  { id: 20, name: '谢尔', role: '前端开发' },
  { id: 21, name: '孟夏', role: '数据分析' },
  { id: 22, name: '罗一', role: '品牌运营' },
  { id: 23, name: '段星', role: '后端开发' },
  { id: 24, name: '余欢', role: '客户成功' },
  { id: 25, name: '季然', role: '产品设计' },
  { id: 26, name: '俞川', role: '前端开发' },
  { id: 27, name: '高远', role: '数据分析' },
  { id: 28, name: '邵宁', role: '品牌运营' },
  { id: 29, name: '施南', role: '后端开发' },
  { id: 30, name: '章易', role: '客户成功' },
  { id: 31, name: '金禾', role: '产品设计' },
  { id: 32, name: '秦川', role: '前端开发' },
  { id: 33, name: '尤溪', role: '数据分析' },
  { id: 34, name: '程野', role: '品牌运营' },
  { id: 35, name: '魏然', role: '后端开发' },
  { id: 36, name: '于安', role: '客户成功' },
]

const keyword = ref('')
const lastLoadedAt = ref('')
const tableRef = shallowRef<TableProInstance>()
const columns: TableProColumn<Member>[] = [
  { prop: 'name', label: '成员', minWidth: 140 },
  { prop: 'role', label: '角色', minWidth: 180 },
]

// 实际项目里，这里可以替换成 fetch、axios 或任意请求库。
const requestMembers: TableProRequest<Member> = async ({ page, pageSize, signal }) => {
  await new Promise((resolve) => setTimeout(resolve, 240))

  if (signal.aborted) throw new DOMException('Aborted', 'AbortError')

  const matched = allMembers.filter((item) => {
    const query = keyword.value.trim()
    return !query || item.name.includes(query) || item.role.includes(query)
  })
  const start = ((page ?? 1) - 1) * (pageSize ?? 10)

  return {
    data: matched.slice(start, start + (pageSize ?? 10)),
    total: matched.length,
  }
}

function search() {
  void tableRef.value?.reload({ page: 1 })
}
</script>