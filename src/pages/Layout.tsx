import type { DropdownProps } from "antd";
import {
  CloseCircleOutlined,
  ExpandOutlined,
  InfoCircleOutlined,
  LineOutlined,
  LoadingOutlined,
  MenuOutlined,
  QqOutlined,
  ReloadOutlined,
  SmileTwoTone,
  ToolOutlined,
} from "@ant-design/icons";
import { invokeFn } from "@src-runtime/runtime-web";
import { App, ConfigProvider, Dropdown, theme } from "antd";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import reactLogo from "/src/assets/react.svg";

function Index() {
  const { modal, message, notification } = App.useApp();
  const { token } = theme.useToken();
  useEffect(() => {
    // 挂载到 全局 window 上, 可以让后端调用这个函数
    // @ts-ignore
    window.call_js_fn = (a, b, c) => {
      notification.success({
        title: "提示",
        description: "js被调用了",
      });
      return a * b - c;
    };
  }, [notification]);

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [checkUpdateText, setCheckUpdateText] = useState("检查更新");

  // 已经不需要使用 useMemo,
  // React Compiler 会自动优化, 只在必要的时候重新执行
  const menuList: { name: string, dropdown: DropdownProps }[] = [
    {
      name: "文件",
      dropdown: {
        menu: {
          items: [
            {
              label: "新建",
              key: "新建",
            },
            {
              label: "打开",
              key: "打开",
            },
            {
              label: "打开文件夹",
              key: "打开文件夹",
            },
            {
              label: "最近工作区",
              key: "最近工作区",
              children: [
                {
                  label: "demo1.txt",
                  key: "demo1.txt",
                },
                {
                  label: "demo2.txt",
                  key: "demo2.txt",
                },
                {
                  label: "demo3.txt",
                  key: "demo3.txt",
                },
              ],
            },
            {
              type: "divider",
            },
            {
              label: "退出",
              key: "退出",
            },
          ],
        },
      },
    },
    {
      name: "帮助",
      dropdown: {
        styles: {
          root: {
            top: 25,
            backgroundColor: token.colorFillAlter,
            border: "2px solid orange",
            borderRadius: token.borderRadius,
          },
        },
        open: dropdownOpen,
        onOpenChange: (nextState, info) => {
          if (info.source === "trigger" || nextState) {
            setDropdownOpen(nextState);
          }
        },
        menu: {
          onClick(info) {
            if (info.key != "检查更新") {
              setDropdownOpen(false);
            }
          },
          items: [
            {
              icon: <SmileTwoTone />,
              label: "欢迎",
              key: "欢迎",
            },
            {
              icon: <ToolOutlined />,
              label: "切换开发人员工具",
              key: "切换开发人员工具",
              onClick() {
                invokeFn("open_devtools");
              },
            },
            {
              icon:
                checkUpdateText != "检查更新"
                  ? (
                      <LoadingOutlined />
                    )
                  : (
                      <ReloadOutlined />
                    ),
              label: checkUpdateText,
              key: "检查更新",
              disabled: checkUpdateText != "检查更新",
              onClick() {
                setCheckUpdateText("正在检查更新..");
                setTimeout(() => {
                  message.success("已经是最新版!");
                  setCheckUpdateText("检查更新");
                }, 3000);
              },
            },
            {
              icon: <InfoCircleOutlined />,
              label: "关于",
              key: "关于",
              onClick() {
                modal.info({
                  content: (
                    <div>
                      <h1>Visual Studio Code</h1>
                      <div>版本: 1.106.0 (system setup)</div>
                      <div>提交: ac4cbdf48759c7d8c3eb91ffe6bb04316e263c57</div>
                      <div>日期: 2025-11-11T16:02:25.943Z</div>
                      <div>Electron: 37.7.0</div>
                      <div>ElectronBuildId: 12597478</div>
                      <div>Chromium: 138.0.7204.251</div>
                      <div>Node.js: 22.20.0</div>
                      <div>V8: 13.8.258.32-electron.0</div>
                      <div>OS: Windows_NT x64 10.0.19045</div>
                    </div>
                  ),
                });
              },
            },
          ],
        },
      },
    },
  ];
  return (
    <div
      className={classNames(
        // NOTE: 需要在 右边和下边 留出 2px 空间,
        // 因为 webviewtoo 的 sizer 有误差,
        // 偶尔会把浏览器控件的这两个边挡住一点
        "h-[calc(100vh-2px)] w-[calc(100vw-2px)]",
        "flex flex-col overflow-hidden bg-white",
        "inset-ring-1 inset-ring-gray-400",
      )}
    >
      {/* 顶部标题栏 start */}
      <div className="aa-drag-box flex items-center border-b select-none">
        {/* logo 与 菜单 */}
        <div className="flex w-1/2 items-center space-x-2">
          {/* logo */}
          <LogoBox />
          {/* 菜单 */}
          <div className="aa-no-drag-box hidden space-x-1 md:flex">
            <ConfigProvider
              theme={{
                token: {
                  // 开关动画
                  motion: false,
                },
              }}
            >
              {menuList.map((v) => {
                return (
                  <Dropdown key={v.name} {...v.dropdown} trigger={["click"]}>
                    <div className="px-1 hover:bg-gray-200">{v.name}</div>
                  </Dropdown>
                );
              })}

              {/* <MoreDropdown /> */}
            </ConfigProvider>
          </div>
          <div className="ml-3 px-1 hover:bg-gray-300 md:hidden">
            <Dropdown
              menu={{
                items: menuList.map((v) => {
                  return {
                    key: v.name,
                    label: v.name,
                    children: v.dropdown.menu?.items,
                  };
                }),
              }}
              trigger={["click"]}
            >
              <MenuOutlined />
            </Dropdown>
          </div>
        </div>

        <div className="flex grow items-center justify-between">
          {/* 标题 */}
          <div className="hidden w-full lg:block">
            <div className="aa-vip-card -translate-x-1/2 space-x-1">
              <QqOutlined />
              <span>React</span>
              <span>&</span>
              <span>AutoHotKey</span>
            </div>
          </div>
          {/* 窗口操作 */}
          <WindowOperationBox />
        </div>
      </div>
      {/* 顶部标题栏 end */}
      {/* 内容区域  start */}
      <div className="aa-w-h-full grow overflow-hidden">
        <div className="aa-w-h-full flex overflow-hidden">
          {/* 左侧内容 start */}
          <div className="aa-scrollbar-thin h-full w-15 overflow-auto border-r p-1">
            {Array.from({ length: 50 }).map((_, i) => {
              return (
                <div
                  key={i}
                  className="aa-flex-center p-2 select-none hover:text-blue-500"
                >
                  <ExpandOutlined />
                </div>
              );
            })}
          </div>
          {/* 左侧内容 end */}
          {/* 右侧内容 start */}
          <div className="mr-1 h-full grow overflow-auto p-1">
            <Outlet />
          </div>
          {/* 右侧内容 end */}
        </div>
      </div>
      {/* 内容区域 end */}
      <div className="border-t p-1 text-sm">小提示:123</div>
    </div>
  );
}

export default Index;

let LogoBox = () => {
  return (
    <div className="group ml-1 h-[30px] w-[30px]">
      {/* group-hover 旋转 logo */}
      <img
        draggable={false}
        src={reactLogo}
        width={25}
        height={25}
        alt=""
        className="aa-logo-spin top-[2px] left-[5px] select-none"
      />
    </div>
  );
};
const styleRightTopButton
  = "group aa-no-drag-box aa-flex-center px-1 select-none";
let WindowOperationBox = () => {
  return (
    <div className="aa-w-h-full flex justify-end">
      <div
        onClick={() => invokeFn("min_webview_gui")}
        className={classNames(styleRightTopButton, "hover:text-blue-500")}
      >
        <LineOutlined className="group-hover:animate-ping" />
      </div>
      <div
        onClick={() => invokeFn("max_webview_gui")}
        className={classNames(styleRightTopButton, "hover:text-blue-500")}
      >
        <ExpandOutlined className="group-hover:animate-spin" />
      </div>
      <div
        onClick={() => invokeFn("hide_webview_gui")}
        className={classNames(styleRightTopButton, "hover:text-red-500")}
      >
        <CloseCircleOutlined className="group-hover:animate-spin" />
      </div>
    </div>
  );
};
