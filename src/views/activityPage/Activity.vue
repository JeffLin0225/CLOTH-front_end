<template>
<div class="divimg" >
    <br>
      
    <div class="row">
        <h3 class="col-2"><strong><font-awesome-icon :icon="['fas', 'tags']" /> 所有特價活動</strong></h3>
        <div class="col-2">
            <button type="button"  class="trigger-button" @click="openModal('insert')"><strong>新增活動特價</strong></button>
        </div>
        <div class="col-2">
            <input class="form-control me-2" type="text" placeholder="尋找特價名稱" v-model="findName" @input="callFind(1)">
        </div>
        <div class="col-2">
            <ActivityRows :total="total">
            </ActivityRows>
        </div>
    </div>
    <br> 

    <div class="row">
        <ActivityCard v-for="activity in activitys" :key="activity.id" :activity="activity"
                    @custom-open="openModal" @custom-delete="callRemove">
        </ActivityCard>
    </div>
                                                                                           
    <ActivityInsert ref="activityModal" :is-show-insert-button="isShowInsertButton" v-model="activity"
                @custom-insert="callCreate" @custom-update="callModify">
    </ActivityInsert>
</div>
</template>

<script setup>
    import axiosapi from '@/plugins/axios.js';
    import Swal from 'sweetalert2';
    import Paginate from 'vuejs-paginate-next';
    import ActivityCard from '@/components/ActivityCard.vue';
    import ActivityRows from '@/components/ActivityRows.vue';
    import ActivityInsert from '@/components/ActivityInsert.vue';
    import { ref, onMounted } from 'vue';



    //分頁 start
    const total = ref(0);   //總資料筆數
    const pages = ref(0);   //總共頁數
    const current = ref(0); //目前頁碼
    const rows = ref(4);    //最多抓幾筆資料
    const start = ref(0);   //從哪裡開始抓資料
    const lastPageRows = ref(0)
    //分頁 end

    const findName = ref("");
    const isShowInsertButton = ref(false);
    const activitys = ref([ ]);
    const activity = ref({ });
    const activityModal = ref(null);
    
    onMounted(function() {
        callFind();
    });

    function openModal(action, id) {
        if(action==='insert') {
            isShowInsertButton.value = true;
            activity.value = { };
        } else {
            isShowInsertButton.value = false;
            callFindById(id);
        }
        activityModal.value.showModal();

    }
    let authority = sessionStorage.getItem("authority");

    let user = sessionStorage.getItem("username");
    if (!user) {
        user = "";
    }
    function callCreate() {
        Swal.fire({
            text: "執行中......",
            allowOutsideClick: false,
            showConfirmButton: false,
        });

        if(activity.value.name=="") {
            activity.value.name = null;
        }
        if(activity.value.discount_percent==="") {
            activity.value.discount_percent = 1;
        }
        
        if(activity.value.start_at=="") {
            activity.value.start_at = null;
        }
        if(activity.value.end_at=="") {
            activity.value.end_at = null;
        }
        activity.value.created_by = user;
        if(activity.value.created_by=="") {
            activity.value.created_by = null;
        }
        // console.log("request", activity.value);

        axiosapi.post("/backstage/activity/create", activity.value).then(function(response) {
            console.log("response", response);
            if(response.data.success)  {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                }).then(function(result) {
                    activityModal.value.hideModal();
                    callFind(current.value);
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
                text: "新增錯誤："+error.message,
            });
        });
    }
    function callRemove(id) {
        Swal.fire({
            icon: 'question',
            text: '確定要刪除？',
            showCancelButton: true,
            allowOutsideClick: false
        }).then(function(result) {
            if(result.isConfirmed) {
                Swal.fire({
                    text: "執行中......",
                    allowOutsideClick: false,
                    showConfirmButton: false,
                });
                if(id) {
                    axiosapi.delete("/backstage/activity/delete/"+id).then(function(response) {
                        console.log("response", response);
                        if(response.data.success) {
                            Swal.fire({
                                icon: "success",
                                text: response.data.message,
                            }).then(function(result) {
                                if(lastPageRows.value==1 && current.value>1) {
                                    current.value = current.value - 1;
                                }
                                callFind(current.value);
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
                            text: "刪除錯誤："+error.message,
                        });
                    });
                }
            }
        });
    }
    function callFindById(id) {
        Swal.fire({
            text: "處理中.....",
            allowOutsideClick: false,
            showConfirmButton: false
        });

        axiosapi.get(`/backstage/activity/${id}`).then(function(response) {
            activity.value = response.data.list[0];

            setTimeout(function() {
                Swal.close();
            }, 500);
        }).catch(function(error) {
            console.log("error", error);
            Swal.fire({
                text: "查詢失敗："+error.message,
                icon: "error"
            });
        });
    }
    function callModify() {
        Swal.fire({
            text: "執行中......",
            allowOutsideClick: false,
            showConfirmButton: false,
        });

        if(activity.value.id=="") {
            activity.value.id = null;
        }
        if(activity.value.name=="") {
            activity.value.name = null;
        }
        if(activity.value.discount_percent==="") {
            activity.value.discount_percent = 1;
        }
        if(activity.value.start_at=="") {
            activity.value.start_at = null;
        }
        if(activity.value.end_at=="") {
            activity.value.end_at = null;
        }
        if(activity.value.created_by=="") {
            activity.value.created_by = null;
        }
        activity.value.updated_by = user;
        if(activity.value.updated_by=="") {
            activity.value.updated_by = null;
        }

        axiosapi.put(`/backstage/activity/${activity.value.id}`, activity.value).then(function(response) {
            console.log("response", response);
            if(response.data.success)  {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                }).then(function(result) {
                    activityModal.value.hideModal();
                    callFind(current.value);
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
                text: "修改錯誤："+error.message,
            });
        });

    }

    function callFind(page) {

        //計算分頁
        if(page) {
            start.value = (page-1) * rows.value;
            current.value = page;
        } else {
            start.value = 0;
            current.value = 1;
        }

        if(findName.value==="") {
            findName.value = null;
        }
        let request = {
            "start": start.value,
            "max": rows.value,
            "dir": false,
            "order": "id",
            "name": findName.value,
        };
        axiosapi.post("/backstage/activity/find", request).then(function(response) {
            activitys.value = response.data.list;

            total.value = response.data.count;
            pages.value = Math.ceil(total.value / rows.value);
            lastPageRows.value = total.value % rows.value;

            // setTimeout(function() {
            //     Swal.close();
            // }, 500);
        }).catch(function(error) {
            console.log("error", error);
            Swal.fire({
                text: "查詢失敗："+error.message,
                icon: "error"
            });
        });
    }
</script>

<style>

.trigger-button {
padding: 12px 24px;
font-size: 18px;
background-color: rgb(248, 213, 55);
color: black;
border: none;
border-radius: 6px;
cursor: pointer;
transition: background-color 0.3s;
}
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
</style>