<template>
  <ElTablePro
    :columns="columns"
    :request="requestProducts"
    :filter="filter"
    row-key="id"
    :pagination="{ pageSize: 10 }"
  />
</template>

<script setup lang="ts">
import {
  ElTablePro,
  type TableProColumn,
  type TableProFilterConfig,
  type TableProRequest,
} from 'element-plus-suite'

interface Product {
  id: number
  title: string
  category: string
  brand: string
  price: number
  rating: number
  stock: number
  meta: {
    updatedAt: string
  }
}

interface ProductQuery {
  keyword: string
  category: string
  modifiedAfter: string
}

interface ProductResponse {
  products: Product[]
  total: number
}

const PRODUCT_API = 'https://dummyjson.com/products'

const columns: TableProColumn<Product>[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'title', label: '商品名称', minWidth: 240, showOverflowTooltip: true },
  { prop: 'category', label: '分类', minWidth: 150 },
  { prop: 'brand', label: '品牌', minWidth: 130 },
  {
    prop: 'price',
    label: '价格',
    width: 100,
    formatter: (_row, _column, value) => `$${value}`,
  },
  { prop: 'rating', label: '评分', width: 90 },
  {
    prop: 'meta.updatedAt',
    label: '最后修改',
    minWidth: 180,
    formatter: (_row, _column, value) => new Date(value).toLocaleString(),
  },
]

const filter: TableProFilterConfig<ProductQuery> = {
  schema: [
    {
      key: 'keyword',
      label: '商品名称',
      defaultValue: '',
      col: { span: 8 },
      fieldProps: { placeholder: '搜索商品名称' },
    },
    {
      key: 'category',
      label: '分类',
      type: 'select',
      defaultValue: '',
      col: { span: 8 },
      fieldProps: {
        options: [
          { name: '美妆', id: 'beauty' },
          { name: '香水', id: 'fragrances' },
          { name: '家具', id: 'furniture' },
          { name: '食品', id: 'groceries' },
        ],
        props: {
          label: 'name',
          value: 'id',
        },
      },
    },
    {
      key: 'modifiedAfter',
      label: '修改日期',
      type: 'date',
      defaultValue: '',
      col: { span: 8 },
      fieldProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
        placeholder: '选择开始日期',
        style: {
          width: '100%',
        },
      },
    },
  ],
  formConfig: {
    showCollapseButton: true,
  },
}

const requestProducts: TableProRequest<Product, ProductQuery> = async ({
  page,
  pageSize,
  query,
  signal,
}) => {
  const limit = pageSize ?? 10
  const skip = ((page ?? 1) - 1) * limit
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: 'id,title,category,brand,price,rating,stock,meta',
  })

  let url = PRODUCT_API

  if (query.keyword.trim()) {
    url = `${PRODUCT_API}/search`
    params.set('q', query.keyword.trim())
  }
  else if (query.category) {
    url = `${PRODUCT_API}/category/${query.category}`
  }

  if (query.modifiedAfter) {
    params.set('modifiedAfter', query.modifiedAfter)
  }

  const response = await fetch(`${url}?${params}`, { signal })
  if (!response.ok) throw new Error(`请求失败：${response.status}`)

  const payload = await response.json() as ProductResponse

  return {
    data: payload.products,
    total: payload.total,
  }
}
</script>
