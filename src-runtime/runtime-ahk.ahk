#Include ./ahk-lib/WebViewToo/WebViewToo.ahk
#Include ./ahk-lib/json/json.ahk
#Include ./ahk-lib/base64/Base64.ahk
#Include embedded-assets.ahk ; 嵌入的资源, 打包后只有一个 exe 文件

/**
 * 创建一些默认的参数
 * @param {String} dev_url 前端的开发环境地址
 * @returns {Object} webview2 的各种参数, 使用 ret.name = value, 去添加新值
 * @example
 * 加载的路径,
 * 源码中使用 .Navigate("") 去打开,
 * 不指定,源码中会打开一个默认页面,
 * 可以自己后续调用 g.Control.Navigate("") 去显示 html
 * NOTE: 如果先显示界面,会打开默认页面,再跳转,体验不好
 * 在 Show 前面去调用 Navigate(), 或者 使用这个参数在类初始化的时候就调用
 * 可以跳过默认界面的显示
 * "Url"
 * --
 * 控件的宽高 (默认 640 * 480) (窗口尺寸会与控件尺寸同步)
 * "DefaultWidth"
 * "DefaultHeight"
 * --
 * WebView2Loader.dll 的位置
 * 源码中默认找 同级目录 和 32bit/64bit 目录 中的 dll
 * "DllPath"
 * --
 * 用户数据
 * 源码中默认指向 "C:\Users\admin\AppData\Local\Microsoft\Edge\User Data"
 * "DataDir"
 * --
 * 一些高级的设置
 * https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2environmentoptions
 * "Options"
 * --
 * "EdgeRuntime"
 * "CreatedEnvironment"
 * --
 * 自定义的字符串,
 * 源码中会使用 AHK 的 Format() 进行格式化填充,再调用 NavigateToString(),
 * 还是自己调用 g.Control.NavigateToString("") 去显示 HTML 比较方便
 * "Html"
 * "Css"
 * "JavaScript"
 */
init_webview_settings(dev_url := "http://localhost:5173") {
    ret := {}

    ; https://learn.microsoft.com/zh-cn/microsoft-edge/webview2/concepts/webview-features-flags?tabs=dotnetcsharp
    browser_args := array_to_str([
        "--allow-file-access-from-files"
        , "--allow-insecure-localhost"
        , "--allow-running-insecure-content"
        , "--disable-background-timer-throttling"
        , "--disable-site-isolation-trials"
        , "--disable-web-security"
        , "--msWebView2CancelInitialNavigation"
        , "--no-sandbox"
        , "--disable-features=IsolateOrigins"
        , "--no-first-run"
        , "--disable-infobars"
        , "--disable-features=BlockingFileUrl"
    ], " ")

    ret.Options := {
        AdditionalBrowserArguments: browser_args,
        EnableTrackingPrevention: 0,
    }

    if (A_IsCompiled) {
        ; 编译环境

        temp_dir := A_Temp . "\ahk-webview2\2025-11-29"
        dll_name := "64bit\WebView2Loader.dll"
        dll_path := temp_dir . "\" . dll_name

        ; 释放 Loader.dll 到文件夹
        ; 默认:
        ; 把 脚本文件名 转换成一个固定、唯一、像 UUID 的 16 进制字符串（带短横线分隔)
        ; 如果存在, 会进行比对, 有差异则覆盖
        ; 修改:
        ; 使用自定义的地址, 直接判断文件是否存在,
        ; 更新 dll 后, 发布时把这个地址手动修改, 就可以再创建一个新的文件夹
        if (FileExist(dll_path) == "") {
            ; 将嵌入的 dll 释放到 指定目录
            WebViewCtrl.CreateFileFromResource(dll_name, temp_dir)
        }

        ret.DllPath := dll_path

        ret.Url := "index.html"

    } else {
        ; 开发环境

        ret.Url := dev_url
    }

    return ret

    /**
     * 将数组转字符串
     * @param {Array} arr
     * @param {String} separator
     * @returns {String}
     */
    array_to_str(arr, separator := ",") {
        result := ""
        len := arr.Length
        for index, item in arr {
            result := result . String(item)
            ; ahk 的索引是从 1 开始的,所以最后一位 等于 长度
            if (index < len) {
                result := result . separator
            }
        }
        return result
    }
}

/**
 * 初始化与 web 交互的函数
 * @param {WebViewGui} g WebviewToo 的 GUI 对象
 */
init_bridge(g) {
    ; 将所有硬盘分区都映射到对应的 http 路径
    ;
    ; 分区名称大小写不敏感, 分号可省略, http / https 都可以
    ; http://C:/Users/admin/Desktop/demo.png
    ; http://c:/Users/admin/Desktop/demo.png
    ; http://c/Users/admin/Desktop/demo.png
    ; https://C/Users/admin/Desktop/demo.png
    ;
    ; 在 web 中使用 <img src=""/> 或 fetch(), 当做一个普通的 http 服务器地址使用
    for item in StrSplit(DriveGetList()) {
        g.Control.BrowseFolder(item . ":/", item)
    }

    ; 禁用左下角的 URL 显示
    g.Control.IsStatusBarEnabled := false
    ; 监听消息
    g.Control.WebMessageReceived(onWebMessageReceived)

    /**
     * @param {WebView2.Core} w
     * @param {WebView2.WebMessageReceivedEventArgs} v
     */
    onWebMessageReceived(w, v) {
        message(v.WebMessageAsJson)
    }
    /**
     * 处理 Web 的消息
     * @param {String} msg  json 字符串
     */
    message(msg) {

        /** @type {Map} */
        data := ""
        fn_name := ""
        fn_args := ""
        callback_id := ""
        try {
            data := JSON.parse(msg)
            ; 取出 前端传来的数据
            fn_name := data.Get("fn_name", "") ;字符串
            fn_args := data.Get("args", []) ;数组
            callback_id := data.Get("callback_id", "") ;字符串
            if (fn_name == "") {
                throw "fn_name 为空"
            }
            res := ""
            if (fn_name == "get_a_variable_value") {
                res := get_a_variable_value(fn_args*)
            } else {
                ; 动态调用 AHK 全局作用域的函数 (AHK 标准库 和 自己写的顶层函数)
                ; 无返回值是 "" (空字符串)
                res := %fn_name%(fn_args*)
            }

            if (callback_id != "") {
                postResultDataToWeb(callback_id, res)
            }
        } catch Error as e {
            ; 发送错误信息
            postErrorToWeb(callback_id, {
                Code: msg,
                Message: e.Message,
                Stack: e.Stack,
                What: e.What,
                File: e.File,
                Line: String(e.Line),
                Extra: e.Extra,
            })
        }

    }
    /**
     * 发送返回值到 web
     * @param {String} id 回调函数编号
     * @param {Any} data 数据
     */
    postResultDataToWeb(id, data) {
        v := JSON.stringify({
            callback_id: id,
            args: data
        }, 0)
        ; 回调函数有效才调用
        g.PostWebMessageAsJson(v)
    }
    postErrorToWeb(id, err_msg) {
        /** @type {Object} */
        res := {
            err: err_msg,
        }
        if (id != "") {
            res.callback_id := id
        }
        g.PostWebMessageAsJson(JSON.stringify(res, 0))
    }
    get_a_variable_value(name) {
        return %name%
    }
}

/**
 * 添加一个托盘菜单项, 设置为图标点击后的默认行为
 * 
 * (如果不希望添加菜单项, 请使用 标准库的 A_TrayMenu.Default:="my_name")
 * @param {Func} fn 执行的函数,在调用 show 和 一些逻辑
 * @param {String} menu_item_name 菜单项的名称
 * @param {Integer} is_double_click 是否双击, false 单击
 * @param {Integer} add_top_divider 上方添加 1 条分割线
 * @param {Integer} add_bottom_divider 下方添加 1 条分割线
 * @example
 * trayClickExecMenuItem(show_gui, "open my window")
 * show_gui() {
 *     g_gui.Show()
 * }
 */
add_default_tray_menu(fn, menu_item_name := "OpenWindow", is_double_click := false, add_top_divider := true, add_bottom_divider := false) {
    ; 添加分割线
    if add_top_divider {
        A_TrayMenu.Add()
    }
    ; 添加菜单项并指定回调函数
    A_TrayMenu.Add(menu_item_name, (*) => fn())
    if add_bottom_divider {
        A_TrayMenu.Add()
    }
    ; 设置点击后的默认行为
    A_TrayMenu.Default := menu_item_name
    A_TrayMenu.ClickCount := is_double_click ? 2 : 1
}

/**
 * 设置托盘图标的图片
 * (标准库这个函数在没有文件时会报错,所以包一层)
 * @param p_img_path 图片路径
 */
tray_set_icon(p_img_path) {
    if FileExist(p_img_path) {
        TraySetIcon(p_img_path)
    }
}

/**
 * 拖动窗口
 * @param hwnd 窗口句柄
 */
drag_window(hwnd) {
    ; 释放鼠标捕获，确保其他窗口可以接收鼠标消息
    DllCall("ReleaseCapture")
    ; 获取顶级窗口的句柄
    AncestorHwnd := DllCall("GetAncestor", "Int", hwnd, "Int", GA_ROOT := 2)
    ; 向父窗口发送 WM_NCLBUTTONDOWN 消息，参数 2 表示在标题栏按下，这会触发窗口拖动
    PostMessage(0x00A1, 2, 0, , AncestorHwnd) ;WM_NCLBUTTONDOWN
}

; 输出到控制台, C# 的 Console.WriteLine() 简写
cw(args*) {
    text := JSON.stringify(args, 0)
    try FileAppend(Format("LOG: {}: {} `n", date_time_now(), text), "*", "utf-8")
}

date_time_now() {
    return FormatTime(, "HH:mm:ss.") A_MSec
}

; @region 标准库二次封装
FileReadRaw(p_path) {
    data := FileRead(p_path, "Raw")
    return Base64.Encode(data)
}

FileReadUTF8(p_path) {
    data := FileRead(p_path, "UTF-8")
    return data
}
; @endregion
