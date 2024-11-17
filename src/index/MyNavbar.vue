<template>
  <div class="navbar">
    <div class="col-12 col-md-5" >
      <!-- <img src="/dist/manageicon.png" alt="Logo"> -->
        <RouterLink class="navbar-brand" to="/" style="font-size: 40px;"><font-awesome-icon :icon="['fas', 'house']" /></RouterLink>
        <RouterLink v-show="authoritys!=null"  class="navbar-item" :to="{ name: 'pages-product-link' }"><strong><font-awesome-icon :icon="['fas', 'shirt']" /> 商品管理</strong></RouterLink>
        <RouterLink v-show="authoritys!=null"  class="navbar-item" :to="{ name: 'pages-activity-link' }"><strong><font-awesome-icon :icon="['fas', 'tags']" /> 特價活動管理</strong></RouterLink>
        <RouterLink v-show="authoritys!=null"  class="navbar-item" :to="{ name: 'pages-coupon-link' }"><strong><font-awesome-icon :icon="['fas', 'ticket']" /> 折價卷管理</strong></RouterLink>
        <!-- <RouterLink  class="navbar-item" :to="{ name: 'pages-USER-link' }"><strong><font-awesome-icon :icon="['fas', 'ticket']" /> USER</strong></RouterLink> -->
        
        <RouterLink v-if="authoritys=='Manager'" class="navbar-item" :to="{ name: 'pages-admin-link' }"><strong><font-awesome-icon :icon="['fas', 'people-roof']" /> 員工管理</strong></RouterLink>
        <RouterLink v-if="authoritys=='Manager'" class="navbar-item" :to="{ name: 'pages-order-link' }"><strong><font-awesome-icon :icon="['fas', 'list-ol']" /> 訂單管理</strong></RouterLink>
        <br> 
        
        <!-- <RouterLink v-if="authority=='Manager'" class="navbar-item" :to="{ name: 'pages-Customerservice-link' }"><strong><font-awesome-icon :icon="['fas', 'headset']" /> 客服管理</strong></RouterLink> -->
    </div>

      <!-- <div class="col-12 col-md-4  navbar-links">
       
      </div> -->

    <div class="col-12 col-md-2 ">
      <div class="navbar-center" style="color: orange; text-shadow: 0.5px 0.5px 0.5px black ; font-family:Verdana, Geneva, Tahoma, sans-serif ;"><strong>JST後臺管理系統</strong></div>
    </div>
      
    
    <div class="col-12 col-md-5   navbar-right" >
      <div class="user-info" style="margin-left: 30px;">
        <RouterLink v-if="authoritys=='Manager' || authoritys=='Customerservice'" class="navbar-item" :to="{ name: 'pages-Comment-link' }"><strong><font-awesome-icon :icon="['fas', 'comment-dots']" /> 評論管理</strong></RouterLink>
        &emsp;
        <div @mouseenter="domouseenter" @mouseleave="domouseout" class="dropdown-trigger">
        <h3><font-awesome-icon :icon="['fas', 'user-tie']" /></h3>
        <AdminInfor  :dropdown-visible="dropdownVisible"> </AdminInfor>
        </div>

        <div v-show="id"  >
        <h4><strong>編號:{{id}} 登入者: {{username}} 權限: {{authority}}</strong></h4>
        </div>
        <div v-show="ids"  >
        <h4><strong>編號:{{ids}} 登入者: {{usernames}} 權限: {{authoritys}}</strong></h4>
        </div>
        
        <div v-show="ids==null"><el-button type="primary" @click="login"><strong>登入</strong></el-button></div>
        
        <div v-show="ids"><el-button type="danger" @click="logout">登出</el-button></div>
        
      </div>
    </div>
  </div>
</template>


  <script setup>
  import { ref } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  const router = useRouter();
  import axiosapi from '@/plugins/axios.js';
  import { inject } from 'vue';

  import AdminInfor from './pages/AdminInfor.vue';

  const id = ref(sessionStorage.getItem("id"));

  console.log('id=',id);
  const username = ref(sessionStorage.getItem("username" ));
  const authority = ref(sessionStorage.getItem("authority"));

  const ids =inject("id");
  console.log('ids=',ids);
  const usernames =inject("username");
  const authoritys =inject("authority");
 
  const dropdownVisible = ref(false);

function domouseenter() {
  dropdownVisible.value =  true ;
}
function domouseout() {
  dropdownVisible.value =  false ;
}

  function login() {
      router.push({ name: 'secure-login-link' });
      

  }
  
  function logout() {
      axiosapi.defaults.headers.authorization = "";
      sessionStorage.clear();
      window.location.reload();
      router.push({ name: 'secure-login-link' });
  }


  </script>

<style>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(243, 225, 202);
  height: 100px;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 10px;
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.navbar-brand {
  margin-left: 30px;
  
}

.navbar-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap; /* 允许换行以适应不同屏幕宽度 */
}

.router-link-active {
  color: blue;
  font-weight: bold;
  border-bottom: 3px solid blueviolet;
}

.navbar-item {
  text-decoration: none;
  color: black;
  font-size: 20px;
  line-height: 1.4; 
  transition: color 0.3s, border-bottom 0.3s;
  /* display: flex; */
  align-items: center; /* 确保图标和文字对齐 */
  margin-left: 10px;
}

.navbar-item:hover {
  color: darkblue;
  border-bottom: 3px solid rgb(248, 150, 3);
}

.navbar-center {
  font-size: 35px;
  text-align: center;
  flex: 1;
  margin: 0;
  white-space: nowrap;
  font-style: italic;
}




.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-right .user-info {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.navbar-brand img {
  width: 50px;
}

.user-info h4 {
  
  margin: 0;
  font-size: 18px;
}

.logout-button {
  padding: 5px 10px;
  border: 1px solid red;
  border-radius: 15px;
  background-color: transparent;
  color: red;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.login-button {
  padding: 5px 10px;
  border: 1px solid rgb(127, 105, 226);
  border-radius: 15px;
  background-color: transparent;
  color: rgb(37, 57, 231);
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.login-button:hover {
  background-color: rgb(9, 102, 224);
  color: white;
}

.logout-button:hover {
  background-color: red;
  color: white;
}

.dropdown-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-top: 5px;
  padding: 10px;
  display: none;
}

.dropdown-trigger:hover .dropdown-menu {
  display: block;
}

.dropdown-trigger {
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
}

.dropdown-container {
  position: absolute;
  top: 100%;
  left: 0;
  background: transparent;
}


</style>