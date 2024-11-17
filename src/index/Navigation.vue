<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/">
          <img src="/dist/manageicon.png" alt="" style="width: 50px;">
        </RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                產品管理
              </a>
              <ul class="dropdown-menu">
                <li>
                  <RouterLink class="dropdown-item" :to="{ name: 'pages-product-link' }">Product</RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" :to="{ name: 'pages-ProductUpload-link' }">ProductUpload</RouterLink>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'pages-activity-link' }">特價活動管理</RouterLink>
            </li>
          </ul><h3 class="me-3 mb-0">後臺管理系統</h3>
          <div class="d-flex align-items-center ms-auto">
            
            
            <button   @click="login">登入</button>
            <button  class="btn btn-outline-danger ms-2" @click="logout">登出</button>
           
          </div>
        </div>
      </div>
    </nav>
  </template>

<script setup>
 import { RouterLink, useRouter } from 'vue-router';
 const router = useRouter();
 import axiosapi from '@/plugins/axios.js';

  function logout() {
      axiosapi.defaults.headers.authorization = "";
      sessionStorage.clear();
      router.push({ name: 'secure-login-link' });
  }

</script>
    
<style>

.navbar-brand img {
  width: 50px;
}
.navbar-nav .nav-link {
  font-size: 18px;
}
.navbar-nav .dropdown-menu {
  min-width: 150px;
}
.d-flex h3 {
  margin-right: 15px;
  font-size: 24px;
}
.ms-auto {
  margin-left: auto;
}
</style>