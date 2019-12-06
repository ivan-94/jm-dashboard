import EventEmitter from 'events'
import { observable } from 'mobx'
import path from 'path'
import os from 'os'
import { api } from 'jm-blocks'
import { ensureDir, isExists } from '~/utils/fs'
import { clone } from '~/utils/git-sync'

const cacheDir = path.join(os.homedir(), '.jm-blocks')
const CURRENT_SOURCE_KEY = 'blocks-source'

export class BlockStore extends EventEmitter {
  @observable
  public initialing: boolean = true

  @observable
  public initialError?: Error

  @observable
  public syncing: boolean = false

  @observable
  public syncError?: Error

  @observable
  public source?: string
  public target?: string
  public blocks?: api.Blocks

  /**
   * 显式列表
   */
  @observable
  showList: boolean = false

  public constructor() {
    super()
    this.initial()
  }

  public initial = async () => {
    try {
      this.initialing = true
      this.initialError = undefined
      await ensureDir(cacheDir)
      const source = window.localStorage.getItem(CURRENT_SOURCE_KEY) || undefined

      // 源已存在
      if (source) {
        const target = this.getTarget(source)
        if (await isExists(target)) {
          this.target = target
          this.source = source
          this.showList = true
          this.blocks = new api.Blocks(target)
          return
        } else {
          // 源不存在
          // 需要重亲请求
        }
      }
    } catch (err) {
      this.initialError = err
    } finally {
      this.initialing = false
    }
  }

  public pull = () => {
    this.sync(this.source!)
  }

  public async sync(source: string) {
    try {
      this.syncing = true
      this.syncError = undefined
      this.validateSource(source)
      const target = this.getTarget(source)
      await clone(source, this.getTarget(source))

      this.source = source
      this.target = target
      window.localStorage.setItem(CURRENT_SOURCE_KEY, source)
      this.blocks = new api.Blocks(target)
    } catch (err) {
      this.syncError = err
    } finally {
      this.syncing = false
    }
  }

  // TODO: 支持tag
  public search(q: string) {
    return this.blocks!.search(q, [])
  }

  private validateSource(source: string) {
    if (source == null || source.trim() === '' || !source.endsWith('.git')) {
      throw new Error('请输入合法的 Git 源')
    }
  }

  private getTarget = (source: string) => {
    const dir = path.basename(source, '.git')
    return path.join(cacheDir, dir)
  }
}

const inst = new BlockStore()
export default function useBlockStore() {
  return inst
}
