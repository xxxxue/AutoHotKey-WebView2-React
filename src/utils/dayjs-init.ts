// 使用方法: 直接引入 import "./utils/dayjsInit.ts";
import dayjs from "dayjs";
import calenderPlugin from "dayjs/plugin/calendar";

import duration from "dayjs/plugin/duration";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/zh-cn";

dayjs.extend(duration);
dayjs.extend(updateLocale);
dayjs.extend(relativeTimePlugin);
dayjs.extend(calenderPlugin);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.updateLocale("zh-cn", {
  // A : 上午/下午/晚上 , dddd: 星期
  // lastDay: 'YYYY.MM.DD [昨天] A h:mm dddd',
  calendar: {
    lastDay: "[昨天] A h:mm ",
    sameDay: "[今天] A h:mm ",
    nextDay: "[明天] A h:mm ",
    lastWeek: "A h:mm [上]dddd",
    nextWeek: "A h:mm [下]dddd",
    sameElse: "YYYY.MM.DD",
  },
});
// 设置语言
dayjs.locale("zh-cn");
// 设置时区 ( 如果不设置, 那 nodejs (webpack插件/vite插件) 在 vercel 等构建平台, 就会用的国外服务器时间)
dayjs.tz.setDefault("Asia/Shanghai");

console.log("dayjs: 初始化完成");
