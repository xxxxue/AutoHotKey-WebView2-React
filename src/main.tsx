/* eslint-disable react-refresh/only-export-components */
import type { FC, PropsWithChildren } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { App as AntdApp, ConfigProvider } from "antd";

import zhCN from "antd/locale/zh_CN";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";

import { HashRouter as Router, useRoutes } from "react-router";
import routes from "./routes/index.tsx";
import "./index.css";
import "./utils/dayjs-init.ts";
// 重置 css (如果不加这个,组件会有很多细节问题, 比如 drawer 会造成页面抖动)
import "antd/dist/reset.css";

const AntdConfigProvider: FC<PropsWithChildren> = (props) => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // 开关动画
          motion: true,
        },
      }}
    >
      <AntdApp>{props.children}</AntdApp>
    </ConfigProvider>
  );
};
function App() {
  return (
    <>
      <Suspense
        fallback={(
          <div className="flex h-screen w-screen items-center justify-center">
            <span>Loading...</span>
          </div>
        )}
      >
        {useRoutes(routes)}
      </Suspense>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AntdConfigProvider>
    <NiceModal.Provider>
      <Router>
        <App />
      </Router>
    </NiceModal.Provider>
  </AntdConfigProvider>,
  //  </StrictMode>
);
