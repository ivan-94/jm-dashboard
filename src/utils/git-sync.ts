/**
 * git 数据源同步器
 */
import fs from 'fs'
import { clone as cl, plugins, pull as pl } from 'isomorphic-git'
import { ensureDir } from './fs'

plugins.set('fs', fs)

/**
 * 克隆远程项目到本地
 * @param source
 * @param target
 */
export async function clone(source: string, target: string) {
  await ensureDir(target)
  return cl({
    url: source,
    dir: target,
    ref: 'master',
    singleBranch: true,
    depth: 1,
  })
}

export async function pull(target: string) {
  return pl({
    dir: target,
    ref: 'master',
    singleBranch: true,
  })
}
