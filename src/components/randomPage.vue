<template>
    <div class="pages">
        <!--pages/test2/test2.wxml-->
        <div v-for="(item, index) in arr" :key="index">
            <img class="div" src="./go.png" :style="{
            height: item.item.height + 'px',
            width: item.item.width + 'px',
            left: item.left + 'px',
            top: item.top + 'px',
        }">
        </div>
    </div>
</template>

<script>
import config from "@/components/config";
import methodUtil from "@/utils/methodUtil";

// 图片大小随机范围
let max = 45;
let min = 25;

// 图片扩散屏幕范围
let windowWidth = 0;
let windowHeight = 0;
export default {
    data() {
        return {
            arr: []
        };
    },
    onLoad: function (options) {


        wx.onWindowResize((e) => {

        })

    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.pages {
    width: 200vw;
    height: 100vh;
    margin: 0 auto;
    position: relative;
}

.div {
    position: absolute;
    border-radius: 999rpx;
    border: 1px solid #d0d0d0;
}
</style>