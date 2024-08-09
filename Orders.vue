<template>
<div class="divimg" >
    <br>

        <div class="row align-items-center">
            <h3 class="col-4"><strong><font-awesome-icon :icon="['fas', 'list-ol']" /> 所有訂單</strong></h3>
        </div>
        <br>
        <!-- 未完成訂單區 -->
        <div class="row justify-content-center">
            <div class="col-3">
                <h3><font-awesome-icon :icon="['fas', 'list']" />&nbsp;<strong>待處理訂單&emsp;&emsp;&emsp;舊<font-awesome-icon :icon="['fas', 'arrow-right']" />新</strong></h3>
            </div>
            <div class="col-3">
                <OrdersRows :total="undonetotal"></OrdersRows>
            </div>
            <div class="col-3">
                <input type="text" placeholder="尋找會員未處理訂單" v-model="undonefindName" @input="callFindundonefind(1)"
                    class="form-control" />
            </div>

            <div class="card-container">
                <OrdersCard v-for="order in undoneorders" :key="order.orderid" :order="order" @custom-open="calldone">
                </OrdersCard>
            </div>

            <div v-show="undonetotal != 0">
                <div class="pagination-container">
                    <Paginate class="paginate" :first-last-button="true" first-button-text="第一頁" last-button-text="最後一頁"
                        prev-text="&lt;" next-text="&gt;" :page-count="undonepages" :initial-page="undonecurrent"
                        v-model="undonecurrent" :click-handler="callFindundonefind">
                    </Paginate>
                </div>
            </div>
        </div>
        <hr>
        <!-- 已完成訂單區 -->
        <div class="row justify-content-center">
            <div class="col-3">
                <h3><font-awesome-icon :icon="['fas', 'list-check']" />&nbsp;<strong>已處理訂單&emsp;&emsp;&emsp;新<font-awesome-icon :icon="['fas', 'arrow-right']" />舊</strong></h3>
            </div>
            <div class="col-3">
                <OrdersRows :total="donetotal"></OrdersRows>
            </div>
            <div class="col-3">
                <input type="text" placeholder="尋找會員已處理訂單" v-model="donefindName" @input="callFinddonefind(1)" class="form-control" >
            </div>
            
            <div class="card-container">
                <OrdersCardDone v-for="order in doneorders" :key="order.orderid" :order="order"></OrdersCardDone>
            </div>

            <div class="pagination-container">
                <div class="row">
                    <div class="col-8" v-show="donetotal != 0">
                        <Paginate class="paginate" :first-last-button="true" first-button-text="第一頁"
                            last-button-text="最後一頁" prev-text="&lt;" next-text="&gt;" :page-count="donepages"
                            :initial-page="donecurrent" v-model="donecurrent" :click-handler="callFinddonefind">
                        </Paginate>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>


<script setup>
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';
import Paginate from 'vuejs-paginate-next';
import OrdersCard from '@/components/OrdersCard.vue';
import OrdersRows from '@/components/OrdersRows.vue';
import { ref, onMounted } from 'vue';
import OrdersCardDone from '@/components/OrdersCardDone.vue';

const findName = ref("");
const orders = ref([]);
const order = ref({});

//分頁 start
const total = ref(0);   //總資料筆數
const pages = ref(0);   //總共頁數
const current = ref(0); //目前頁碼
const rows = ref(4);    //最多抓幾筆資料
const start = ref(0);   //從哪裡開始抓資料
const lastPageRows = ref(0)
//分頁 end

const undonefindName = ref("");
const undoneorders = ref([]);
//分頁 start  //////////////////未處理
const undonetotal = ref(0);   //總資料筆數
const undonepages = ref(0);   //總共頁數
const undonecurrent = ref(0); //目前頁碼
const undonerows = ref(4);    //最多抓幾筆資料
const undonestart = ref(0);   //從哪裡開始抓資料
const undonelastPageRows = ref(0)
//分頁 end

const donefindName = ref("");
const doneorders = ref([]);
//分頁 start   //////////////////已處理
const donetotal = ref(0);   //總資料筆數
const donepages = ref(0);   //總共頁數
const donecurrent = ref(0); //目前頁碼
const donerows = ref(4);    //最多抓幾筆資料
const donestart = ref(0);   //從哪裡開始抓資料
const donelastPageRows = ref(0)
//分頁 end

onMounted(function () {
    callFinddonefind();
    callFindundonefind();
});

function calldone(id) {
    axiosapi.put('/backstage/orders/modify/' + id)
        .then(function (response) {
            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                }).then(function () {
                    callFinddonefind();
                    callFindundonefind();
                })
            } else {
                Swal.fire({
                    icon: "warning",
                    text: response.data.message,
                })
            }

        })
        .catch(function (error) {
            Swal.fire({
                icon: "error",
                text: "修改錯誤:" + error.message,
            })
        })
}

let user = sessionStorage.getItem("username");
if (!user) {
    user = "";
}

function callFinddonefind(donepage) {

    //計算分頁
    if (donepage) {
        donestart.value = (donepage - 1) * donerows.value;
        donecurrent.value = donepage;
    } else {
        donestart.value = 0;
        donecurrent.value = 1;
    }

    if (donefindName.value === "") {
        donefindName.value = null;
    }
    let request = {
        "start": donestart.value,
        "max": donerows.value,
        "dir": false, //true生冪 false降冪
        "order": "shipping_at",
        "status": '已出貨',
        "userid": donefindName.value,
    };
    axiosapi.post("/backstage/orders/donefind", request).then(function (response) {
        doneorders.value = response.data.list;

        donetotal.value = response.data.count;
        donepages.value = Math.ceil(donetotal.value / donerows.value);
        donelastPageRows.value = donetotal.value % donerows.value;

    }).catch(function (error) {
        console.log("error", error);
        Swal.fire({
            text: "查詢失敗：" + error.message,
            icon: "error"
        });
    });
}

function callFindundonefind(undonepage) {

    //計算分頁
    if (undonepage) {
        undonestart.value = (undonepage - 1) * undonerows.value;
        undonecurrent.value = undonepage;
    } else {
        undonestart.value = 0;
        undonecurrent.value = 1;
    }

    if (undonefindName.value === "") {
        undonefindName.value = null;
    }
    let request = {
        "start": undonestart.value,
        "max": undonerows.value,
        "dir": true, //true生冪 false降冪
        "order": "created_at",
        "status": '未出貨',
        "userid": undonefindName.value,
    };
    axiosapi.post("/backstage/orders/undonefind", request).then(function (response) {
        undoneorders.value = response.data.list;

        undonetotal.value = response.data.count;
        undonepages.value = Math.ceil(undonetotal.value / undonerows.value);
        undonelastPageRows.value = undonetotal.value % undonerows.value;

    }).catch(function (error) {
        console.log("error", error);
        Swal.fire({
            text: "查詢失敗：" + error.message,
            icon: "error"
        });
    });
}

</script>

<style scoped>

.divimg {
  background-image: url('@/img/789.jpg'); /* 设置背景图像 */
  background-size: cover; /* 确保背景图像覆盖整个容器 */
  background-position: center; /* 将背景图像居中 */
  background-repeat: no-repeat; /* 防止背景图像重复 */
  position: relative; /* 使覆盖层相对于父容器定位 */
  height: 100%;

}

.divimg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.651); 
  z-index: 1; 
}

.divimg > * {
  position: relative; /* 使子元素相对于父容器定位，以确保它们在覆盖层之上 */
  z-index: 2;
}
.col-2 {
    flex: 1;
    margin-bottom: 10px;
}

.card-container {
    
    display: flex;
    flex-wrap: wrap;
    gap:60px;
    justify-content: center;
}

/* 卡片樣式 */
.orders-card,
.orders-card-done {
    flex: 1 1 calc(33.333% - 20px);
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.orders-card h5,
.orders-card-done h5 {
    margin-bottom: 10px;
}

.orders-card .activity-actions,
.orders-card-done .activity-actions {
    margin-top: auto;
}
</style>