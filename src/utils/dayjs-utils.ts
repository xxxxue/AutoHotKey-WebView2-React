import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const _formatTemplate = "YYYY-MM-DD HH:mm:ss";

export function dayjsGetNow() {
  return dayjs().format(_formatTemplate);
}

export function dayjsGetFormat(data: string | Dayjs) {
  return dayjs(data).format(_formatTemplate);
}

export function dayjsGetFormatYMD(data: string | Dayjs) {
  return dayjs(data).format("YYYY-MM-DD");
}

export function dayjsGetFormatHMS(data: string | Dayjs) {
  return dayjs(data).format("HH:mm:ss");
}
