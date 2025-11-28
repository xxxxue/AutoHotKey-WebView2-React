; 由于 ahk 有很多全局函数,用的 (大)驼峰命名法,
; 所有自己的函数用 下划线命名法, 便于区分, 防止重名
; --------------------- Settings -----------------
#Requires AutoHotkey v2.0 64-bit
#SingleInstance force ;只允许启动一个实例, 直接替换旧实例
Persistent() ;持续运行
SetWorkingDir(A_ScriptDir)

; --------------------- Include -----------------
#Include ..\src-runtime\runtime-ahk.ahk

; --------------------- TrayMenu -----------------

; 星星图标
TraySetIcon('Shell32.dll', 44)
; 添加 托盘菜单项
add_default_tray_menu(() => show_webview_gui())
A_TrayMenu.Add("ExitApp", (*) => ExitApp())

; --------------------- GUI -----------------
; 初始化 webview2 默认参数
g_settings := init_webview_settings()

; 创建 webview2 窗口
g_Window := WebViewGui("-Caption +Resize", , , g_settings)
g_Window.Title := "React & AutoHotKey"

; 初始化与 web 交互的函数
init_bridge(g_Window)
; 显示
show_webview_gui()

return

; --------------------- function -----------------

; @region 窗口操作函数

; 显示
show_webview_gui() {
    ; 显示窗口
    g_Window.Show(Format("w{} h{} Center", A_ScreenWidth * 0.5, A_ScreenHeight * 0.5))
}
; 隐藏
hide_webview_gui() {
    g_Window.Hide()
}
; 最大化
max_webview_gui() {
    if (WinGetMinMax(g_Window.Hwnd) == 1) {
        g_Window.Restore()
    } else {
        g_Window.Maximize()
    }
}
; 最小化
min_webview_gui() {
    g_Window.Minimize()
}

; @endregion

; @region js 拖动窗口函数(未使用)

/** 让 web 控件可以拖动整个窗口 (未使用, 采用的 css 实现)*/
js_drag_window() {

    ; css 实现,给某个元素添加 css ,就可以触发原生的拖动 (浏览器内部的实现)
    ; 右键会触发系统的标题栏菜单, 使用 js 实现则不会触发
    /**
     * .my-drag-box {
     *    -webkit-app-region: drag;
     * }
     */

    ; js实现,拖动某个元素,触发整个窗口的拖动
    /**
     *   // useEventListener(
     *   //   "mousedown",
     *   //   () => {
     *   //     drag_state_ref.current = true;
     *   //   },
     *   //   { target: drag_box_ref }
     *   // );
     *   // useEventListener(
     *   //   "mouseup",
     *   //   () => {
     *   //     drag_state_ref.current = false;
     *   //   },
     *   //   { target: drag_box_ref }
     *   // );
     *   // useEventListener(
     *   //   "mousemove",
     *   //   () => {
     *   //     if (drag_state_ref.current) {
     *   //       invokeFn("js_drag_window");
     *   //     }
     *   //   },
     *   //   { target: drag_box_ref }
     *   // );
     */
    drag_window(g_Window.Hwnd)
}

; @endregion

test_fn(a, b, c, d) {
    return a * b * c * d
}

test_fn2() {
    MsgBox(1)
}

exec_js_test() {
    ; 调用 js 中自定义的 window.call_js_fn 函数
    exec_js(g_Window, "call_js_fn(4,2,1)", (r) => ToolTip("拿到 js 返回值:" r))
}

/**
 * 执行 js 并获取返回值
 * @param {WebViewGui} g webview 对象
 * @param {String} code js代码
 * @param {(res:any)=>void} callback_fn 接收返回值的函数
 */
exec_js(g, code, callback_fn?) {
    ; NOTE: 不知为什么 await 一直等不到返回值, 只能用 回调函数 了.
    a := g.Control.ExecuteScriptAsync(code)
    if (IsSet(callback_fn)) {
        a.then(callback_fn)
    }
}

open_devtools() {
    g_Window.Control.OpenDevToolsWindow()
}