import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextData {
  requestId: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContextData>();

export const RequestContext = {
  run(data: RequestContextData, fn: () => void) {
    return asyncLocalStorage.run(data, fn);
  },

  get(): RequestContextData | undefined {
    return asyncLocalStorage.getStore();
  },

  getRequestId(): string | undefined {
    return asyncLocalStorage.getStore()?.requestId;
  },
};
