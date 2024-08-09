<template>
<div ref="exampleRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel"><strong>廣播使用者</strong></h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <table class="table table-striped">
              <tr>
                <td ><strong><h1 style="color: brown;">廣播內容 :</h1></strong></td>
                <td><input type="text" name="name" v-model="message" class="form-control"></td>
              </tr>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="trigger-button"  @click="sendMessage" ><strong>廣播</strong></button>

      </div>
    </div>
  </div>
</div>
</template>

<script setup>
 import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"
  import { ref, onMounted } from 'vue'
  

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
const message = ref(null);
const client = ref(null); // 將 client 定義為 ref
const information = ref(null); // 將 client 定義為 ref
const exampleRef = ref(null);
const exampleModal = ref(null);
onMounted(() => {
  exampleModal.value = new bootstrap.Modal(exampleRef.value);
  initWebSocket();
});
function showModal() {
    exampleModal.value.show();
  }
  
function hideModal() {
  exampleModal.value.hide();
}

defineExpose({ showModal, hideModal });

function initWebSocket() { 
  client.value = new Client({
    // WebSocket 代理的 URL
    brokerURL: 'ws://192.168.23.149:8080/cloth/ws/chat',
    
    // 使用 SockJS 创建 WebSocket 连接的函数
    webSocketFactory: () => new SockJS('http://192.168.23.149:8080/cloth/ws/chat'),
    
    debug: function (str) {
      console.log(str);
    },
    onConnect: () => {
      console.log('WebSocket connected');
    },
    onStompError: (frame) => {
      console.error('STOMP Error', frame);
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    }
  });
  client.value.activate();
}

function sendMessage() {
    console.log("MEssage=",message.value);
    
    if (client.value && client.value.connected) {
      client.value.publish({
          destination: `/app/send/Coupon`,
          body: JSON.stringify({ content: message.value, timestamp: new Date().toISOString() }),
          headers: { 'content-type': 'application/json' },
          onReceipt: (frame) => {
              console.log('Message sent successfully');
          }
      });
    } else {
        console.error('WebSocket not connected');
    }
    message.value='';
    hideModal();
}

</script>

<style scoped>

.trigger-button {
padding: 8px 24px;
font-size: 18px;
background-color: white;
color: black;
border: 3px solid blue;
border-radius: 6px;
cursor: pointer;
transition: background-color 0.3s;
}

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
