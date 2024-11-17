<template>
  <div v-if="dropdownVisible"  class="dropdown-menu">
    
    <table> 
      <tbody >
        <tr >
          <td><strong>員工編號 :</strong></td>
          <td><input type="text" v-model="admin.id" readonly/></td>
        </tr>
        <tr>
          <td><strong>姓名 :</strong></td>
          <td><input type="text" v-model="admin.name" readonly/></td>
        </tr>
        <tr>
          <td><strong>職位 :</strong></td>
          <td><input type="text" v-model="admin.authority" readonly/></td>
        </tr>
        <tr>
          <td><strong>性別 :</strong></td>
          <td><input type="text" v-model="admin.gender" readonly /></td>
        </tr>
        <tr>
          <td><strong></strong>生日 :</td>
          <td><input type="text" v-model="admin.birth" readonly/></td>
        </tr>
        <tr>
          <td><strong>電話 :</strong></td>
          <td><input type="text" v-model="admin.phone" /></td>
        </tr>
        <tr>
          <td><strong>信箱 :</strong></td>
          <td><input type="text" v-model="admin.email" /></td>
        </tr>
        <tr>
          <td><strong>地址 :</strong></td>
          <td><input type="text" v-model="admin.address" /></td>
        </tr>
        <tr>
          <td><strong>入職時間 :</strong></td>
          <td><input type="text" v-model="admin.created_at" readonly/></td>
        </tr>
      </tbody>
    </table>
    <button class="edit-button" @click="edit">更新資料</button>
 
</div>
</template>

<script setup>
import axiosapi from '@/plugins/axios';
import { ref, onMounted ,watch } from 'vue';
import Swal from 'sweetalert2';
import { inject } from 'vue';

const props = defineProps(['dropdownVisible']);

const admin = ref({
  id: '',
  name: '',
  authority: '',
  birth: '',
  phone: '',
  email: '',
  address: '',
  created_at: ''
});

const sessionid = ref(sessionStorage.getItem("id") );
// const ids = inject("id", null);

watch(() => props.dropdownVisible, (newVisible) => {
  if (newVisible) {
   const sessionid = sessionStorage.getItem("id");
    if (sessionid) {
      dofindadm(sessionid);
    }
  }
});
  

function dofindadm(sessionid) {
  axiosapi.get('/backstage/secure/findAdminById/'+sessionid )
    .then(function(response) {
      console.log('Response data:', response.data); // 检查响应数据
      admin.value = response.data.admin[0]; // 更新 admin 对象
    })
    .catch(function(error) {
      console.error('Error fetching admin data:', error);
    });
}


function edit() {
  const request = {
    id: admin.value.id,
    gender: admin.value.gender,
    birth: admin.value.birth,
    phone: admin.value.phone,
    email: admin.value.email,
    address: admin.value.address,
  };

  axiosapi.put('/backstage/secure/modify',request )
    .then(function(response) {
      if(response.data.success)  {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                }).then(function(result) {

                });
            } else {
                Swal.fire({
                    icon: "warning",
                    text: response.data.message,
                });
            }
        }).catch(function(error) {
            console.log("error", error);
            Swal.fire({
                icon: "error",
                text: "更新錯誤："+error.message,
            });
        });

}
</script>

<style scoped>
.dropdown-menu {
  background-color: #eee4c4;
  border: 1px solid #ddd;
  border-radius: 15px; /* 外框圆角 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 10px;
  min-width: 400px; /* 设置最小宽度 */
  box-sizing: border-box;
  position: absolute;
  top: 100%; /* 确保下拉菜单在触发器下方显示 */
  left: 0;
  z-index: 1200; /* 确保下拉菜单在最上层 */
  overflow: hidden; /* 隐藏溢出内容 */
}

/* 表格样式 */
table {
  width: 100%;
  border-collapse: separate; /* 避免边框合并 */
  border-spacing: 0; /* 去除单元格间距 */
  border-radius: 8px; /* 表格圆角 */
  overflow: hidden; /* 隐藏溢出内容 */
}

td {
  padding: 8px;
  vertical-align: middle;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

/* 输入框样式 */
input[type="text"] {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px; /* 输入框圆角 */
  box-sizing: border-box;
}

/* 按钮样式 */
.edit-button {
  padding: 8px 16px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  margin-top: 10px; /* 给按钮留出空间 */
}

.edit-button:hover {
  background: linear-gradient(135deg, #0056b3, #003d7a);
  transform: scale(1.05);
}

</style>
