import { describe, expect, it } from 'vitest'
import {
  normalizePagination,
  TABLE_PRO_DEFAULT_PAGINATION,
} from '../types/index'

describe('TablePro pagination config', () => {
  it('省略分页时返回默认配置', () => {
    expect(normalizePagination(undefined)).toEqual({
      ...TABLE_PRO_DEFAULT_PAGINATION,
    })
  })

  it('显式 true 表示使用默认分页', () => {
    expect(normalizePagination(true)).toEqual({
      ...TABLE_PRO_DEFAULT_PAGINATION,
    })
  })

  it('显式 false 表示关闭分页', () => {
    expect(normalizePagination(false)).toBeNull()
  })

  it('局部配置与默认值合并', () => {
    expect(normalizePagination({ pageSize: 50 })).toMatchObject({
      page: 1,
      pageSize: 50,
      pageSizes: [10, 20, 50, 100],
      pagerCount: 5,
    })
  })
})
