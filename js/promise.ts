class MyPromise<T> {
  private value: T | undefined;
  private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
  private onFulfilledCallbacks: Array<(value: T) => void> = [];
  private onRejectedCallbacks: Array<(reason: any) => void> = [];

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  private resolve(value: T): void {
    if (this.state === 'pending') {
      this.state = 'fulfilled';
      this.value = value;
      this.onFulfilledCallbacks.forEach((callback) => callback(value));
    }
  }

  private reject(reason: any): void {
    if (this.state === 'pending') {
      this.state = 'rejected';
      this.onRejectedCallbacks.forEach((callback) => callback(reason));
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): MyPromise<TResult1 | TResult2> {
    const onFulfilledCallback = typeof onFulfilled === 'function' ? onFulfilled : (value: T) => value;
    const onRejectedCallback = typeof onRejected === 'function' ? onRejected : (reason: any) => { throw reason; };

    const promise = new MyPromise<TResult1 | TResult2>((resolve, reject) => {
      const handleFulfilled = (value: T) => {
        try {
          const result = onFulfilledCallback!(value);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      const handleRejected = (reason: any) => {
        try {
          const result = onRejectedCallback!(reason);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === 'fulfilled') {
        handleFulfilled(this.value as T);
      } else if (this.state === 'rejected') {
        handleRejected(this.value as any);
      } else {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });

    return promise;
  }
}
