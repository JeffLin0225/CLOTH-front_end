<template>
<div class="divimg" >
    <br>
    
    <div class="row">
        <h3 class="col-2"><strong><font-awesome-icon :icon="['fas', 'ticket']" /> 所有折價卷</strong></h3>
        <div class="col-2">
            <button type="button"  class="trigger-button"  @click="openModal('insert')"><strong>新增折價卷</strong></button>
        </div>
        <div class="col-1">
            <button type="button"  class="trigger-button2"  @click="openINFModal()"><strong>廣播</strong></button>
        </div>
        <div class="col-2">
            <input class="form-control me-2" type="text" placeholder="尋找折價卷名稱" v-model="findName" @input="callFind(1)">
        </div>
        <div class="col-2">
            <CouponRows :total="total"></CouponRows>
        </div>
    </div>
    <br> 

    <div class="row">
        <CouponCard v-for="coupon in coupons" :key="coupon.id" :coupon="coupon"
                    @custom-open="openModal" @custom-delete="callRemove">
    </CouponCard>
    </div>
                                                                                           
    <CouponInsert ref="couponModal" :is-show-insert-button="isShowInsertButton" v-model="coupon"
                @custom-insert="callCreate" @custom-update="callModify">
    </CouponInsert>
    <CouponInfo ref="couponINFoModal" >
    </CouponInfo>
</div>
</template>

<script setup>
    import axiosapi from '@/plugins/axios.js';
    import Swal from 'sweetalert2';
    import CouponCard from '@/components/CouponCard.vue';
    import CouponRows from '@/components/CouponRows.vue';
    import CouponInsert from '@/components/CouponInsert.vue';
    import CouponInfo from '@/components/CouponInfo.vue';
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
    const coupons = ref([ ]);
    const coupon = ref({ });
    const couponModal = ref(null);
    const couponINFoModal = ref(null);

    onMounted(function() {
        callFind();
    });

    function openModal(action, id) {
        if(action==='insert') {
            isShowInsertButton.value = true;
            coupon.value = { };
        } else {
            isShowInsertButton.value = false;
            callFindById(id);
        }
        couponModal.value.showModal();

    }
    
    function openINFModal() {
        
        couponINFoModal.value.showModal();

    }

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

        if(coupon.value.name=="") {
            coupon.value.name = null;
        }
        if(coupon.value.description==="") {
            coupon.value.description = null;
        }
        if(coupon.value.discount==="") {
            coupon.value.discount = 0;
        }
        
        if(coupon.value.start_at=="") {
            coupon.value.start_at = null;
        }
        if(coupon.value.end_at=="") {
            coupon.value.end_at = null;
        }
        coupon.value.created_by = user;
        if(coupon.value.created_by=="") {
            coupon.value.created_by = null;
        }
        // console.log("request", coupon.value);

        axiosapi.post("/backstage/coupon/create", coupon.value).then(function(response) {
            console.log("response", response);
            if(response.data.success)  {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                }).then(function(result) {
                    couponModal.value.hideModal();
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
                    axiosapi.delete("/backstage/coupon/delete/"+id).then(function(response) {
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

        axiosapi.get(`/backstage/coupon/${id}`).then(function(response) {
            coupon.value = response.data.list[0];

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

        if(coupon.value.id=="") {
            coupon.value.id = null;
        }
        if(coupon.value.name=="") {
            coupon.value.name = null;
        }
        if(coupon.value.description==="") {
            coupon.value.description = null;
        }
        if(coupon.value.discount==="") {
            coupon.value.discount = 0;
        }
        if(coupon.value.start_at=="") {
            coupon.value.start_at = null;
        }
        if(coupon.value.end_at=="") {
            coupon.value.end_at = null;
        }
        if(coupon.value.created_by=="") {
            coupon.value.created_by = null;
        }
        coupon.value.updated_by=user;
        if(coupon.value.updated_by=="") {
            coupon.value.updated_by = null;
        }

        axiosapi.put(`/backstage/coupon/${coupon.value.id}`, coupon.value).then(function(response) {
            console.log("response", response);
            if(response.data.success)  {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                }).then(function(result) {
                    couponModal.value.hideModal();
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
        axiosapi.post("/backstage/coupon/find",request).then(function(response) {
            coupons.value = response.data.list;

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

.trigger-button2 {
padding: 8px 24px;
font-size: 18px;
background-color: white;
color: black;
border: 3px solid blue;
border-radius: 6px;
cursor: pointer;
transition: background-color 0.3s;
}
.divimg {
  background-image: url('@/img/123.jpg'); /* 设置背景图像 */
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