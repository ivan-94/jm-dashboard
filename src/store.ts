export class Store {
  public source?: string
}

const inst = new Store()
export default function useGlobalStore() {
  return inst
}
