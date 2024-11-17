<template>
    <div ref="exampleRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">新增折價卷</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <table class="table table-striped">
              <tr>
                <td>折價卷名稱 :</td>
                <td><input type="text" name="name" :value="modelValue.name" @input="doinput('name', $event)" class="form-control"></td>
              </tr>
              <tr>
                <td>描述 :</td>
                <td><input type="text" name="description" :value="modelValue.description" @input="doinput('description', $event)" class="form-control"></td>
              </tr>
              <tr>
                <td>折扣幅度 :</td>
                <td><input type="number" name="discount_percent" :value="modelValue.discount" @input="doinput('discount', $event)" class="form-control"></td>
                <td>元</td>
              </tr>
              <tr>
                <td>起始日期 :</td>
                <td><input type="date" name="start_at" :value="modelValue.start_at" @input="doinput('start_at', $event)" class="form-control"></td>
              </tr>
              <tr>
                <td>結束日期 :</td>
                <td><input type="date" name="end_at" :value="modelValue.end_at" @input="doinput('end_at', $event)" class="form-control"></td>
              </tr>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-dark" v-show="isShowInsertButton" @click="emits('customInsert')">新增</button>
            <button type="button" class="btn btn-warning" v-show="!isShowInsertButton" @click="emits('customUpdate')">修改</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"
  import { ref, onMounted } from 'vue'
  
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
  
  <style>
  .modal-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }
  
  .modal-title {
    color: #343a40;
  }
  
  .table td {
    padding: 8px;
    vertical-align: middle;
  }
  
  .form-control {
    width: 100%;
  }
  
  .btn-dark {
    background-color: #343a40;
    border-color: #343a40;
  }
  
  .btn-warning {
    background-color: #ffc107;
    border-color: #ffc107;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
  }
  </style>
  