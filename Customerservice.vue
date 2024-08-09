<template>
<div style="margin-left:10px; margin-right: 10px" >
        <br>
        
        <div class="row">
            <h3 class="col-2"><strong>客服處理</strong></h3>
            <div class="col-2">
                <input type="text" placeholder="尋找使用者名稱" v-model="findName" @input="callFind(1)">
            </div>
        </div>
        <br> 
        <div class="row container">
          <div class="col-4">

          </div>
                <div class="scroll-container col-2">
                    客人編號
                    <div class="scrollable-content">
                        <div v-for="user in users"  :key="user.userid" class="user" :class="{ active: user.userid === selectedUserId }"  @click="ClickFindByUser(1,user.userid)">                   
                            {{ user.userid }} 號
                            <span v-if="user.unreadMessageCount != 0">({{ user.unreadMessageCount }} 未讀 ) </span>                                           
                        </div>
                    </div>        
                </div>
                <div class="scroll-container col-6" >
                        <div id="scrollid" class='scrollable-content2' @scrollend="onScroll">               
                            <div v-for="mes in mess" :key="mes.chats" :class="['message' ,getMessageClass(mes)]" >                             
                              <div >
                               <span v-if=" mes.chats !=null"> {{ mes.chats }}</span>
                               &nbsp;
                                <span><img v-if="mes.imgnull==true" :src="`${path}${mes.id}`" :alt="mes.name" style="width: 60px;"></span>
                              </div>
                                <span style="font-size:15px;color: gray;">{{mes.time}}</span>
                            </div>                                     
                        </div> 
                        <hr>
                    <div @change="handleKeydown">
                        <FileUpload class="btn btn-light"	accept="imge/*"
                                input-id="filess" input-name="filess" v-model="filess"
                                :multiple="false">
                        選擇圖片
                        </FileUpload>
                    <span v-for="(file, index) in filess" :key="file.id">
                      {{ file.name }}
                    <input type="button" value="刪除檔案" @click="deleteFile(file.id)" class="btn btn-dark">
                    </span>     
                  </div>
                  <textarea name="message" id="message" v-model="thechats" class="insertclass"   @keyup.enter="handleKeydown"> </textarea>     

                </div>                               
        </div>                 
</div>
  </template>
  
  <script setup>
  import axiosapi from '@/plugins/axios.js';
  import Swal from 'sweetalert2';
  import { ref, onMounted,nextTick ,watch  } from 'vue';
  import { Client } from '@stomp/stompjs';
  import SockJS from 'sockjs-client/dist/sockjs.min.js';
  import FileUpload from 'vue-upload-component'
  const path = import.meta.env.VITE_PHOTO_API_CUS;

  const thechats = ref('');
  const filess = ref([]);
  const selectedUserId = ref(null);
  const userid = ref(null); 
  const total = ref(0);   
  const pages = ref(0);   
  const current = ref(0); 
  const rows = ref(6);    
  const start = ref(0);   
  const lastPageRows = ref(0);
  const page = ref(1);
  const users = ref([]);
  const mess = ref([]);
  const findName = ref("");
  const messages = ref([]);
  const currentUserId = ref(null);
  const client = ref(null);
  const havemessages = ref([]);
  
  let user = sessionStorage.getItem("username");
  if (!user) {
    user = "";
  }
  onMounted(() => {
  callFindAllUser();
  initWebSocket();
});

  //==================================呼叫=================================
  function initWebSocket() {
  client.value = new Client({
    brokerURL: 'ws://localhost:8080/cloth/ws/chat',
    webSocketFactory: () => new SockJS('http://localhost:8080/cloth/ws/chat'),
    connectHeaders: {},
    debug: function (str) {
      console.log(str);
    },
    onConnect: () => {
    console.log('WebSocket connected');
    subscribeToUserTopic() 
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

function subscribeToUserTopic() {
  if (client.value) {
    const topic = `/topic/toAdmin`;
    console.log('Subscribing to topic:', topic);
    client.value.subscribe(topic, (message) => {
      havemessages.value.push(JSON.parse(message.body));
      callFindAllUser(1);
      ClickFindByUser(1,3);
      nextTick(() => {
        const container = document.getElementById('scrollid');
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
}
//==================================呼叫===============================

  function callFindAllUser(page) {//找user用的

    if (page) {
      start.value = (page - 1) * rows.value;
      current.value = page;
    } else {
      start.value = 0;
      current.value = 1;
    }
  
    if (findName.value === "") {
      findName.value = null;
    }
    let request = {
      "start": start.value,
      "max": rows.value,
      "dir": false,
      "order": "id",
      "name": findName.value,
    };
    axiosapi.post("/backstage/customerservice/findAdmin", request).then(response => {
      users.value = response.data.list;
      total.value = response.data.count;
      pages.value = Math.ceil(total.value / rows.value);
      lastPageRows.value = total.value % rows.value;
    }).catch(error => {
      console.log("error", error);
      Swal.fire({
        text: "查詢失敗：" + error.message,
        icon: "error"
      });
    });
  }

  function ClickFindByUser(page, id) {
    callFindAllUser(page);
    selectedUserId.value = id; // 选择用户
      if (client.value) {
      // Unsubscribe from the old topic
      if (currentUserId.value !== null) {
        client.value.deactivate();
      }

      currentUserId.value = userid;
      

      client.value.onConnect = () => {
        console.log('WebSocket reconnected');
        subscribeToUserTopic(id);
      };
    
    }
    mess.value = [];
    userid.value=id;
    if (page) {
      start.value = (page - 1) * rows.value;
      current.value = page;
    } else {
      start.value = 0;
      current.value = 1;
    }
  
    if (findName.value === "") {
      findName.value = null;
    }
    let request = {
      "start": start.value,
      "max": rows.value,
      "dir": true,
      "order": "id",
      "name": findName.value,
      "userid": id,
    };
    axiosapi.post("/backstage/customerservice/findAdminMessage" , request).then(response => {  
      mess.value =  response.data.list.reverse();
      total.value = response.data.count;
      pages.value = Math.ceil(total.value / rows.value);
      console.log("Click的pages",pages.value,total.value , rows.value)
      lastPageRows.value = total.value % rows.value;
      nextTick(() => {
        setTimeout(() => {
          const container = document.getElementById('scrollid');
          if (container) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth' // 平滑滚动
            });
          }
        }, 100); // 延迟100毫秒，可以根据需要调整时间
    });  
    }).catch(error => {
      console.log("error", error);
      Swal.fire({
        text: "查詢失敗：" + error.message,
        icon: "error"
      });
    });
  }

  function onScroll(event) {
  const element = event.target;

  // 检查是否滚动到底部
  if (element.scrollTop <= 0) {
    // 加载更多消息
    if (current.value < pages.value) {
      callFindByUser(current.value + 1); // 加载下一页
    } else {
      console.log("已经加载到最后一页了");
    }
  }
}

function callFindByUser(nextPage) {
  if (nextPage > pages.value) {
    console.log("已经加载到最后一页，停止加载");
    return;
  }
  console.log("滾動的page", nextPage);
  console.log("總共pagesss", pages.value);

  start.value = (nextPage - 1) * rows.value;
  current.value = nextPage;

 if (findName.value === "") {
   findName.value = null;
 }
 let request = {
   "start": start.value,
   "max": rows.value,
   "dir": true,
   "order": "id",
  //  "name": findName.value,
   "userid": userid.value,
 };
 console.log("userID",userid.value)
 axiosapi.post("/backstage/customerservice/findAdminMessage" , request).then(response => {
   
   const newMessages = response.data.list.reverse();
     mess.value = [...newMessages, ...mess.value];
   total.value = response.data.count;
   pages.value = Math.ceil(total.value / rows.value);
   lastPageRows.value = total.value % rows.value;
 }).catch(error => {
   console.log("error", error);
   Swal.fire({
     text: "查詢失敗：" + error.message,
     icon: "error"
   });
 });
}

function  getMessageClass(message) {
  return message.adminid == null ? 'left-message' : 'right-message';
}
//============================新增訊息==========================================
let adminidid = sessionStorage.getItem("id");
    if (!adminidid) {
      adminidid = "";
    }
  function handleKeydown(event) {
    console.log("輸入的ID",userid.value);
    event.preventDefault(); 
      client.value.publish({
      destination: `/app/send/byAdmin/3`,
      body: JSON.stringify({
        usersid: 2,
        message:'員工訊息有送進來'
      })});


    if (event.key === 'Enter') {
      
      let formData = new FormData();
          for(let i = 0; i < filess.value.length; i++) {
              formData.append("files", filess.value[i].file);
          }
          formData.append("chats", thechats.value);
          formData.append("adminid", adminidid);
          if(userid.value==null){
           userid.value=0;
          }
          formData.append("usersid", userid.value);

      if(thechats.value != ''|| filess.value.length>0){
        axiosapi.post('/backstage/customerservice/create',formData)
        .then(function(response){
          thechats.value = '';
            filess.value = [];
            ClickFindByUser(1,userid.value);
        })      
        .catch(function(error){
          Swal.fire({
                    icon: 'error',
                    text: error.message,
          });
        })
      }
    }
  }


  function deleteFile(id) {
        for (let i = 0; i < filess.value.length; i++) {
            if (filess.value[i].id === id) {
                filess.value.splice(i, 1);
                break;
            }
        }
        console.log("filess.value", filess.value);
    }

  </script>
  
  <style scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }

  .user {
    padding: 10px;
    cursor: pointer;
    margin-bottom: 5px;
    border-radius: 5px;
    transition: background-color 0.3s;
}

  .user:hover {
      background-color: #34495e;
  }
  .user.active {
  background-color: #3498db; /* 高亮颜色 */
  color: white; /* 文字颜色 */
}
  
  .insertclass {
    width:620px; height: 150px;
    border: 2px solid black;
    border-radius: 10px;
    padding: 5px;
    font-size: 20px;
  }       
  
  .scroll-container {
    width: 300px; /* 設置固定寬度 */
    height:590px; /* 設置固定高度 */
    overflow: auto; /* 使容器在內容超出時顯示滾動條 */
    border: 2px solid #362e1d; /* 添加邊框以清楚顯示容器邊界 */
    padding: 10px; /* 添加內邊距 */
    background-color: antiquewhite;
    display: flex;
    flex-direction: column;
  }

  .scroll-container2 {
    width: 300px; /* 設置固定寬度 */
    height: 300px; /* 設置固定高度 */
    overflow: auto; /* 使容器在內容超出時顯示滾動條 */
    border: 2px solid #362e1d; /* 添加邊框以清楚顯示容器邊界 */
    padding: 10px; /* 添加內邊距 */
    background-color: antiquewhite;
    display: flex;
    flex-direction: column;
  }
  
  .scrollable-content {
    display: flex;
    flex-direction: column;
  }
  .scrollable-content2 {
    display: flex;
    flex-direction: column; /* 反向排列 */
    overflow-y: auto; /* 確保滾動條正常顯示 */
    height: 100%; 
  }
  
  .message {
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    max-width: 60%;
    /* 默認為左側顯示 */
    align-self: flex-start;
  }
  
  .left-message {
    background-color: #aed8f3;
    align-self: flex-start;
    
  }
  
  .right-message {
    background-color: #f1cef3;
    align-self: flex-end;
  }
  
  /* 自定義滾動條樣式（可選） */
  .scroll-container::-webkit-scrollbar {
    width: 8px;
  }
  
  .scroll-container::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
  
  .scroll-container::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  </style>
  