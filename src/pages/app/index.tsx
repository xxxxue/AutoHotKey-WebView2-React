import NiceModal, { antdDrawerV5, useModal } from "@ebay/nice-modal-react";
// import { FileRead } from '@src-runtime/generate-out/ahk-fn-wrapper-gen'
import { useRequest } from "ahooks";
import { Button, Drawer, Image } from "antd";

function Index() {
  const test_click = async () => {
    NiceModal.show(DemoDrawer);
    // let r: any = null

    // let p = String.raw`D:\Work\CppProject\AutoHotkey-alpha\README.md`
    // r = await FileRead(p, 'UTF-8')

    // let p = String.raw`C:\Users\admin\Desktop\test_file.txt`;
    // r = await FileExist(p);
    // if (r != "") {
    //   await FileDelete(p);
    // }
    // await FileAppend(p + " 我是内容", p, "UTF-8");

    // r = await FileGetSize(p, "M");

    // let p = String.raw`C:\Users\admin\Desktop\test_ini_file2.ini`;
    // await FileOpen(p, "w", "UTF-16"); // 创建/覆盖
    // await FileAppend("; 配置文件",p)
    // await IniWrite("嘿嘿嘿", p, "UserSettings", "FontTypeTest");
    // await IniWrite("[1, 3, 4, 5, 7]", p, "UserSettings", "FontTypeTest2");
    // await IniWrite(true, p, "UserSettings", "FontTypeTest3");
    // await IniWrite(false, p, "UserSettings", "FontTypeTest4");
    // r = await IniRead(p,"UserSettings","FontTypeTest")
    // invokeFn("exec_js_test");
    // MsgBox("1", "2");

    // r = await FileReadRaw("C:\\Users\\admin\\Desktop\\demo.png")
    // const img = document.getElementById("img") as HTMLImageElement;
    // img.src = "data:image/png;base64," + r;

    // r = await RegRead("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion", "ProgramFilesDir")
    // r = await StrLen("哒哒哒2222")
    // r = await PixelGetColor(127, 368);
    // r = await VerCompare("1.20.0", "1.3");
    // alert(r);
  };
  return (
    <div className="flex flex-col space-y-1">
      <div>
        <Button onClick={test_click}>click</Button>
      </div>
      <div className="h-1/3 w-1/3">
        <Image src="http://C:/Users/admin/Desktop/demo.png" />
      </div>
      <CreateMoreContent />
    </div>
  );
}

export default Index;

let CreateMoreContent = () => {
  return (
    <>
      {Array.from({ length: 30 }).map((_, i) => {
        return (
          <p key={i}>
            ---------------
            {i}
          </p>
        );
      })}
    </>
  );
};

let DemoDrawer = NiceModal.create(() => {
  const modal = useModal();

  const req = useRequest(
    async () => {
      // let p = String.raw`C:/Users/admin/Desktop/ahk-too.txt`;
      // let r = await FileReadUTF8(p);

      // console.time("fetch");

      // let filePath = "C:/Users/admin/Desktop/test_gb2312.txt";
      // // let filePath = "C:/Users/admin/Desktop/test_utf16.txt";

      // let result = await fetch("http://" + filePath)
      //   .then((r) => r.arrayBuffer())
      //   .then((r) => {
      //     // https://developer.mozilla.org/zh-CN/docs/Web/API/Encoding_API/Encodings
      //     // let d = new TextDecoder("UTF-16");
      //     let d = new TextDecoder("gb2312");
      //     return d.decode(r);
      //   });

      // console.timeEnd("fetch");

      // return result;
      return "123";
    },
    {
      cacheKey: "txt-data",
      staleTime: -1, // 10 * 1000,
    },
  );

  return (
    <Drawer placement="right" {...antdDrawerV5(modal)}>
      {req.loading ? <p>loading...</p> : <pre>{req.data}</pre>}
    </Drawer>
  );
});
