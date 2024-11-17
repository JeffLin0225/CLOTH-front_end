<template>
  
  <!-- <div class="navbar-container">  </div> -->
    <MyNarvbar></MyNarvbar>

  <div >
    <RouterView></RouterView>
  </div>
  <p class="footer">
    聯絡我們 購物說明 最新消息 網站使用條款 隱私權政策 免責聲明©
  </p>
</template>
  

  <script setup>
  import MyNarvbar from '../index/MyNavbar.vue';
  import {ref , provide } from 'vue'

  const username = ref(null)
  provide('username',username)
  provide('setUsername',(newUser)=>{
    username.value = newUser;
  })
  const id = ref(null)
  provide('id',id)
  provide('setUserid',(newUserid)=>{
    id.value = newUserid;
  })
  const authority = ref(null)
  provide('authority',authority)
  provide('setUserauthority',(newUserauthority)=>{
    authority.value = newUserauthority;
  })
  </script>
  
  <style scoped>
  .navbar-container {
    width: 100%;
    max-width: 1800px; /* 你可以根据实际需要设置最大宽度 */
    margin: 0 auto; /* 居中对齐 */
  }
  .content {
    margin: 20px;
    padding: 20px;
    background-color: #faeeee; /* 背景颜色使内容区域更明显 */
    border-radius: 10px; /* 圆角效果 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 轻微的阴影效果 */
  }

  .footer {
    margin: 20px;
    text-align: center; /* 使文字居中 */
    font-size: 20px; /* 字体大小 */
    color: #666; /* 字体颜色 */
  }
</style>
 