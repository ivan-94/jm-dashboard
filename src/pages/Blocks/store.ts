import { observable } from 'mobx'
import { api } from 'jm-blocks'

export class BlockStore {
  @observable
  public source?: string
  @observable
  public status: api.SyncStatus = api.SyncStatus.Initial
  @observable
  public initialError?: Error

  public initialSource(source: string) {
    // TODO: 验证来源
    try {
      this.status = api.SyncStatus.Syncing
      this.initialError = undefined
      api.changeSource(source)
    } catch (err) {
      this.initialError = err
    } finally {
      this.updateSyncStatus()
    }
  }

  public constructor() {
    const source = window.localStorage.getItem('block-source') || undefined
    api.onSyncError(err => {
      this.initialError = err
      this.updateSyncStatus()
    })

    api.onSyncSuccess(() => {
      this.updateSyncStatus()
      this.source = api.getCurrentSource()
      window.localStorage.setItem('block-source', this.source)
    })

    if (source) {
      this.initialSource(source)
    }
  }

  public search() {
    return api.search('', [])
  }

  private updateSyncStatus() {
    this.status = api.getSyncStatus()
  }
}

const inst = new BlockStore()
export default function useBlockStore() {
  return inst
}
