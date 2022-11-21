export type Defer<Data = any> = {
  requests: { id: string | number }[];
  promise: Promise<Data>;
  resolve: (data: any) => any;
  reject: (data: any) => any;
};

export const createDefer = () => {
  const defer: Partial<Defer> = {};

  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  defer.requests = [];

  return defer;
};

export const sleep = (ms: number = 700) => new Promise((resolve) => setTimeout(resolve, ms));
