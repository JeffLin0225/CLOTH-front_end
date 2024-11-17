<template>
  <br>
  <div>
    客戶端@click="ClickFindByUser()"
  </div>
  <div class="row container">
          <div class="col-4">

          </div>
                <div class="scroll-container col-2">
                    幾則未讀訊息
                    <div class="scrollable-content">
                        <div  v-if="count!=0"  >                   
                            {{ count }} 則
                                                                       
                        </div>
                    </div>        
                </div>
                <div class="scroll-container col-6" >
                        <div id="scrollid" class='scrollable-content2' >               
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
  const mess = ref([]);
  const messages = ref([]);
  const client = ref(null); // 將 client 定義為 ref
  const havemessages = ref([]);
  const count = ref(0);

const message = ref('');
const newuserid=3;//////////////////////////////////////直接改這裡
// ============================= (id= parsedUser.id) ====================================
onMounted(() => {
  // const user = sessionStorage.getItem('user');
  // if (user) {
  //   const parsedUserID = JSON.parse(user);
  //   console.log('用戶 ID:', parsedUserID.id);  // 這個有印出id: 1
  //   console.log('ID是你嗎: ', parsedUserID.id);
  //   console.log('真的是你ㄟ: ', parsedUserID.id);
  //   console.log('太棒了ㄅ: ', parsedUserID.id);
  // } else {
  //   console.log('sessionStorage 中沒有用戶信息。');
  // }
  initWebSocket();
  HowmanyUnread();
  
});

  function HowmanyUnread(){
  
   
    let request = {
      "userid": newuserid, //UserID 很重要!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    };
    axiosapi.post("/backstage/customerservice/findUserMessage" , request)
    .then(response => {  
      console.log("有吃到USERID",newuserid);
      count.value =  response.data.unreadMessageCount;
    });
  }


  function ClickFindByUser() {
console.log("尋找有作棟");
    mess.value = [];
    
    let request = {
      "userid": newuserid,
    };
    axiosapi.post("/backstage/customerservice/findUserMessage" , request).then(response => {  
      mess.value =  response.data.list.reverse();
    //   client.value.onConnect = () => {
    //   console.log('WebSocket reconnected');
    //   subscribeToUserTopic();
    // };
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

function  getMessageClass(message) {
  return message.adminid == null ? 'right-message' : 'left-message';
}
//============================新增訊息==========================================

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      client.value.publish({
      destination: `/app/send/byUser`,
      body: JSON.stringify({
        usersid: newuserid ,
        message:'客戶訊息有送進來'
      })});
      let formData = new FormData();
          for(let i = 0; i < filess.value.length; i++) {
              formData.append("files", filess.value[i].file);
          }
          formData.append("chats", thechats.value);
          formData.append("usersid", newuserid);

      if(thechats.value != ''|| filess.value.length>0){
        axiosapi.post('/backstage/customerservice/createUser',formData)
        .then(function(response){
          thechats.value = '';
            filess.value = [];
            ClickFindByUser(); 
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

      // Subscribe to the user topic after connecting
      if (client.value) {
        const topic = `/topic/toUser/3`; // You might want to make this dynamic
        console.log('Subscribing to topic:', topic);
        client.value.subscribe(topic, (message) => {
          havemessages.value.push(JSON.parse(message.body));
          HowmanyUnread();      
          ClickFindByUser(); // You may need to pass parameters depending on implementation

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

      HowmanyUnread(); // If this is needed on connect
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
//==================================呼叫===============================
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
    flex-direction: column-reverse; /* 反向排列 */
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