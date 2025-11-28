
type Type_CallbackFunction<T = any> = (err: Type_Error | undefined, result: T) => void;

interface Type_Message {
  callback_id?: string
  args?: any
  err?: Type_Error
}

interface Type_Error {
  Code: string
  Message: string
  Stack: string
  What: string
  File: string
  Line: string
  Extra: string
}

// 核心实现
class MyBridgeClass {
  private _callback_store: { [key: string]: Type_CallbackFunction };

  constructor() {
    this._callback_store = {};
  }

  private _generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private _setCallback(callback: Type_CallbackFunction) {
    const id = this._generateUUID();
    this._callback_store[id] = callback;
    return id;
  }

  private _getCallback(id?: string) {
    if (id != undefined) {
      const callback = this._callback_store[id];
      if (callback != undefined) {
        delete this._callback_store[id];
      }
      return callback;
    }
    return undefined;
  }

  private _post_message(data: any) {
    // @ts-ignore
    chrome.webview.postMessage(data);
  }

  /**
   * 调用后端的函数
   * @param fn_name 函数名
   * @param args 参数
   * @param callback 回调函数
   */
  public invoke<T>(fn_name: string, args: any[] = [], callback?: Type_CallbackFunction<T>) {
    const data: any = {
      fn_name,
      args,
    };
    // 保存回调函数
    if (callback) {
      data.callback_id = this._setCallback(callback);
    }
    // 发送字符串到后端
    this._post_message(data);
  }

  // 调用这个函数，来给前端传递返回值
  public callback(data: Type_Message) {
    const id = data?.callback_id;
    // 后端无返回值是空字符串
    const args = data?.args;
    const err = data?.err;

    const callbackFn = this._getCallback(id); // 获取函数
    if (callbackFn != undefined) {
      // 报错信息 / 后端返回值
      callbackFn(err, args);
    }
  }
}

//  在 web 中调用
export const MyBridge = new MyBridgeClass();

// 挂载到全局 window 上, 可以保留变量名不被打包工具混淆, 后端才能正常调用
// @ts-ignore
window.MyBridge = MyBridge;

// 监听后端的消息
// 后端通过 PostWebMessageAsJson 发送, 前端得到的就是 json 对象, 不用自己转
// @ts-ignore
window.chrome.webview.addEventListener("message", (msg: { data?: Type_Message }) => {
  if (msg == undefined || typeof msg.data != "object"
  ) {
    console.trace("接收到的 msg 不符合规范");
    alert("addEventListener message 函数报错,请查看控制台");
    return;
  }

  const data = msg.data;

  if (data.callback_id != undefined) {
    // 有回调函数,则把返回值和报错信息都传入
    MyBridge.callback(data);
  }
  else if (data.err != undefined) {
    // 没有回调函数, 直接弹窗报错
    const err = data.err;
    alert(`Error: ${err.Message}`);
    console.error(err);
  }
});

// ------------- 封装调用的函数 -------------

// 异步
export function invokeFnAsync<T = any>(fn_name: string, ...args: any[]) {
  return new Promise<T>((resolve, reject) => {
    try {
      MyBridge.invoke<T>(fn_name, args, (err, r) => {
        if (err) {
          // 报错
          reject(err);
          return;
        }

        // 返回数据
        resolve(r);
      });
    }
    catch (r: any) {
      reject(r);
    }
  });
}

// 同步 + 回调函数
export function invokeFn<T = any>(
  fn_name: string,
  callback: Type_CallbackFunction<T>,
): void;

export function invokeFn<T = any>(
  fn_name: string,
  ...args: [...any[], Type_CallbackFunction<T>]
): void;

export function invokeFn(
  fn_name: string,
  ...args: any[]
): void;

export function invokeFn(
  fn_name: string,
  ...args: any[]
) {
  if (args.length > 0) {
    const lastArg = args[args.length - 1];

    let args_arr = args;
    let callback_fn;

    if (typeof lastArg === "function") {
      callback_fn = lastArg;
      // 去掉最后一个,前面的就是参数
      args_arr = args.slice(0, -1);
    }
    // 支持参数为数组
    if (Array.isArray(args_arr[0])) {
      args_arr = args_arr[0];
    }
    MyBridge.invoke(fn_name, args_arr, callback_fn);
  }
  else {
    MyBridge.invoke(fn_name);
  }
}
