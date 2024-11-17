<template>
  <div>
    
    <video controls autoplay muted loop>
      <source :src="videoUrl" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 指定视频文件的路径
const videoUrl = ref(new URL('@/img/7.mp4', import.meta.url).href);
</script>

<style scoped>
video {
  max-width: 100%;
  height: auto;
}
</style>
