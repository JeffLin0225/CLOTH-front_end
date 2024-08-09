<template>
    <div ref="exampleRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">新增特價活動</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <table class="table">
              <tbody>
                <tr>
                  <td class="align-top">活動名稱 :</td>
                  <td><input type="text" name="name" :value="modelValue.name" @input="doinput('name', $event)" class="form-control"></td>
                </tr>
                <tr>
                  <td class="align-top">折扣幅度 :</td>
                  <td>
                    <div class="discount-container">
                      <input type="number" name="discount_percent" :value="modelValue.discount_percent" @input="doinput('discount_percent', $event)" class="form-control">
                      <span class="discount-unit">折</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="align-top">起始日期 :</td>
                  <td><input type="date" name="start_at" :value="modelValue.start_at" @input="doinput('start_at', $event)" class="form-control"></td>
                </tr>
                <tr>
                  <td class="align-top">結束日期 :</td>
                  <td><input type="date" name="end_at" :value="modelValue.end_at" @input="doinput('end_at', $event)" class="form-control"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-dark" v-show="isShowInsertButton" @click="emits('customInsert')">新增</button>
            <button type="button" class="btn btn-danger" v-show="!isShowInsertButton" @click="emits('customUpdate')">修改</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
  import { ref, onMounted } from 'vue';
  
  const props = defineProps(["isShowInsertButton", "modelValue"]);
  const emits = defineEmits(["customInsert", "customUpdate", "update:modelValue"]);
  
  function doinput(key, event) {
    emits('update:modelValue', {
      ...props.modelValue,
      [key]: event.target.value
    });
  }
  
  const exampleRef = ref(null);
  const exampleModal = ref(null);
  
  onMounted(() => {
    exampleModal.value = new bootstrap.Modal(exampleRef.value);
  });
  
  function showModal() {
    exampleModal.value.show();
  }
  
  function hideModal() {
    exampleModal.value.hide();
  }
  
  defineExpose({ showModal, hideModal });
  </script>
  
  <style scoped>
  .modal-body {
    padding: 20px; /* 内边距 */
  }
  
  .table {
    width: 100%;
    margin-bottom: 0; /* 表格下边距 */
  }
  
  .table td {
    padding: 10px; /* 表格单元格内边距 */
  }
  
  .form-control {
    width: 100%;
    max-width: 300px; /* 控制输入框最大宽度 */
  }
  
  .discount-container {
    display: flex;
    align-items: center; /* 垂直居中对齐 */
  }
  
  .discount-unit {
    margin-left: 8px; /* 控制“折”字符的左边距 */
  }
  
  .modal-footer {
    padding: 15px; /* 底部内边距 */
  }
  
  .btn-dark {
    background-color: #343a40; /* 按钮背景色 */
    border: none; /* 移除按钮边框 */
  }
  
  .btn-danger {
    background-color: #dc3545; /* 删除按钮背景色 */
    border: none; /* 移除按钮边框 */
  }
  
  .btn-close {
    background: none; /* 移除关闭按钮背景 */
  }
  </style>
  