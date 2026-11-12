# ElTablePro

## Import

Global registration exists: do not import runtime components in the SFC.

No global registration:

```ts
import { ElTablePro, type TableProColumn } from 'element-plus-suite'
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| columns | `TableProColumn<Record<string, any>>[]` | `[]` |
| data | `Record<string, any>[]` | `[]` |
| request | `TableProRequest<Record<string, any>, Record<string, any>>` \| `undefined` | `undefined` |
| rowKey | `string \| (row) => string \| number` | required |
| query | `Record<string, any>` | `{}` |
| filter | `TableProFilterConfig<Record<string, any>>` | - |
| pagination | `boolean \| TableProPagination` | `true` |
| mergeFields | `string[]` | `[]` |
| headerTitle | `string \| (() => VNodeChild)` | - |
| options | `false \| TableProToolbarOptions` | - |

All native `ElTable` props, events, slots, and instance methods remain available.

## Title bar

```vue
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
</script>

<template>
  <ElTablePro
    headerTitle="Members"
    :columns="columns"
    :request="loadUsers"
    :options="{
      reload: true,
      density: true,
      fullscreen: true,
    }"
  >
    <template #toolbar="{ selectedRows }">
      <ElButton type="primary" :icon="Plus">New</ElButton>
      <ElButton v-if="selectedRows.length">Delete selected</ElButton>
    </template>
  </ElTablePro>
</template>
```

`#headerTitle` completely replaces the title area:

```vue
<template #headerTitle>
  <span>Members</span>
  <ElTag type="success">Active</ElTag>
</template>
```

`TableProToolbarOptions`:

| Field | Type | Notes |
| --- | --- | --- |
| reload | `boolean` | `false`; calls `reload()` |
| density | `boolean` | `false`; dropdown for large/default/small |
| fullscreen | `boolean` | `false`; toggles container fullscreen |

## Static table

```vue
<script setup lang="ts">
import type { TableProColumn } from 'element-plus-suite'

interface User {
  id: number
  name: string
  role: string
}

const columns: TableProColumn<User>[] = [
  { prop: 'name', label: 'Name', minWidth: 140 },
  { prop: 'role', label: 'Role', minWidth: 140 },
]

const data: User[] = [
  { id: 1, name: 'Lin', role: 'Designer' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="data"
    row-key="id"
    :pagination="false"
  />
</template>
```

## Remote table

```vue
<ElTablePro
  :columns="columns"
  row-key="id"
  :request="loadUsers"
/>
```

```ts
import type { TableProRequest } from 'element-plus-suite'

const loadUsers: TableProRequest<User> = async ({ page, pageSize, query, signal }) => {
  const result = await api.users({ page, pageSize, ...query, signal })

  return {
    data: result.items,
    total: result.total,
  }
}
```

Request parameters:

| Param | Type |
| --- | --- |
| page | `number \| null` |
| pageSize | `number \| null` |
| query | `Record<string, any>` |
| signal | `AbortSignal` |

Return:

```ts
{
  data: Row[]
  total: number
}
```

## Columns

```ts
const columns: TableProColumn<User>[] = [
  { prop: 'name', label: 'Name' },
  { prop: 'status', label: 'Status', slot: 'status' },
  { prop: 'role', label: 'Role', autoMerge: true },
]
```

| Field | Type |
| --- | --- |
| visible | `boolean` |
| slot | `string` |
| headerSlot | `string` |
| render | `(scope) => VNodeChild` |
| headerRender | `(scope) => VNodeChild` |
| autoMerge | `boolean` |
| children | `TableProColumn<Record<string, any>>[]` |

Other Element Plus TableColumn props remain available.

## Filter form

```ts
const filter: TableProFilterConfig<UserQuery> = {
  schema: [
    { key: 'keyword', label: 'Keyword', type: 'input' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      fieldProps: {
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Disabled', value: 'disabled' },
        ],
      },
    },
  ],
  formConfig: {
    col: 8,
    showCollapseButton: true,
  },
}
```

```vue
<ElTablePro
  :columns="columns"
  :filter="filter"
  row-key="id"
  :request="loadUsers"
/>
```

Filter fields can be customized with `#filter-<key>` slots.

Filter-specific `formConfig` fields:

| Field | Type |
| --- | --- |
| showCollapseButton | `boolean` |
| collapseRows | `number` |
| collapseCount | `number` |
| collapsed | `boolean` |

## Pagination

```vue
<ElTablePro
  :columns="columns"
  row-key="id"
  :request="loadUsers"
  :pagination="{ pageSize: 50, pageSizes: [20, 50, 100] }"
/>
```

Use `:pagination="false"` to disable it.

## Events

| Event | Payload |
| --- | --- |
| loaded | `{ data: unknown[], total: number }` |
| error | `unknown` |

## Slots

| Slot | Scope |
| --- | --- |
| `headerTitle` | Replaces the complete title area |
| `toolbar` | `{ selectedRows, selectedRowKeys }`; rendered before built-in tools |

## Instance methods

```ts
import { useTemplateRef } from 'vue'
import type { TableProInstance } from 'element-plus-suite'

const tableRef = useTemplateRef<TableProInstance>('tableRef')

await tableRef.value?.reload()
await tableRef.value?.reload({ page: 1 })
await tableRef.value?.search()
await tableRef.value?.resetFilter()
```

Native `ElTable` instance methods remain available.

## Types

```ts
import type {
  TableProColumn,
  TableProFilterConfig,
  TableProInstance,
  TableProPagination,
  TableProRequest,
  TableProToolbarOptions,
} from 'element-plus-suite'
```
