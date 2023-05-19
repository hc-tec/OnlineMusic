<template>
    <svg :style="{
        transform: `rotate(${props.change? 180:0}deg)`
    }" t="1684460073822" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1160" :width="props.myIconSize" :height="props.myIconSize"><path d="M922.069625 477.9341L472.652621 151.089311a43.342807 43.342807 0 0 0-68.847075 35.055725V328.665491L159.636492 151.089311a43.364482 43.364482 0 0 0-68.847076 35.055725v653.682354a43.350032 43.350032 0 0 0 68.847076 35.062951L403.805546 697.328611v142.498779a43.364482 43.364482 0 0 0 68.847075 35.062951l449.417004-326.837565a43.342807 43.342807 0 0 0 0-70.118676z" fill="" p-id="1161"></path></svg>
</template>

<script setup>

const props = defineProps({
  myIconSize: String,
  myIconColor: String,
  change: Boolean,
})
</script>

<style scoped lang="less">
.icon {
    padding-left: 3px;
}
</style>