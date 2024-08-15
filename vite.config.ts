import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path, { join, resolve } from "path";
import requireTransform from "vite-plugin-require-transform";
const staticPath = resolve(__dirname, "static");
export default defineConfig(() => {
  return {
    plugins: [
      vue(), // 开启 Vue 支持
      vueJsx(),
      requireTransform({ fileRegex: /.ts$|.vue$|.png$|.tsx$|.jpg$/ }),
    ],
    resolve: {
      alias: {
        "@/src": join(__dirname, "./src"),
        "@/utils": join(__dirname, "./utils"),
      },
    },
    root: join(__dirname, "src"), // 指向渲染进程目录
    base: "./", // index.html 中静态资源加载位置
    assetsDir: "assets",
    server: {
      port: 2333,
    },
    build: {
      outDir: join(__dirname, "dist"),
      assetsDir: "./assets", // 相对路径 加载问题
      emptyOutDir: true,
    },
    define: {
      "process.env": {
        NODE_ENV: "development",
      },
    },
    publicDir: staticPath,

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(
            __dirname,
            "./src/assets/styles/global/global.less"
          )}";`,
        },
      },
    },
  };
});
