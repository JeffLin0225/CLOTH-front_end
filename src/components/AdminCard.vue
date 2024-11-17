<template>
  <div class="admin-card">
    <div class="admin-info">
      <h1><font-awesome-icon :icon="['fas', 'user-plus']" /></h1>
      <div class="admin-id">員工編號: {{ admin.id }}</div>
      <div><h5 class="admin-name"><strong>姓名: {{ admin.name }}</strong></h5></div>
      <div class="admin-role"><strong>職位: {{ admin.authority }}</strong></div>
      <div class="admin-gender">性別: {{ admin.gender }}</div>
      <div class="admin-phone">電話號碼: {{ admin.phone }}</div>
      <div class="admin-birth">生日: {{ admin.birth }}</div>
      <div class="admin-email">信箱: {{ admin.email }}</div>
      <div class="admin-address">地址: {{ admin.address }}</div>
      <div class="admin-join-date">入職日期: {{ admin.created_at }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["admin"]);
const emits = defineEmits(["customOpen", "customDelete"]);
</script>

<style scoped>
.admin-card {
  max-width: 500px;
  margin: 20px auto; /* 上下左右增加外边距 */
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 1);
  background-color: rgb(231, 244, 248);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #343a40;
}

.admin-info > div {
  margin-bottom: 15px;
  font-size: 16px;
}

.admin-name {
  font-size: 20px;
  margin-bottom: 10px;
  color: #2264aa;
}

.admin-role, .admin-email, .admin-birth, .admin-address, .admin-gender, .admin-phone, .admin-join-date {
  display: flex;
  align-items: center;
  color: #424d58;
  font-weight: bolder
}

.admin-role::before, .admin-email::before, .admin-birth::before, .admin-address::before, .admin-gender::before, .admin-phone::before, .admin-join-date::before {
  content: '•';
  margin-right: 8px;
  color: #6c757d;
}

.admin-id {
  font-weight: bold;
  color: #646b72;
}
</style>
