<template>
<div class="pro"   >
    <br>
    <div class="row">
        <h3 class="col-2"><strong><font-awesome-icon :icon="['fas', 'shirt']" /> 所有商品</strong></h3>
        <div class="col-2">
            
        <ProductSelect class="product-select" @selection-applied="handleSelection"  ></ProductSelect> <!-- 條件搜索 -->
        
        </div>
        <div class="col-2">
        <button type="button"  class="trigger-button"  @click="openUploadModal"><strong>新增商品</strong></button>
        </div>
      
        <div class="col-2">
            <input class="form-control me-2" type="text" placeholder="想找什麼呢?" v-model="findName" @input="callFind(1)">
        </div>
        <div class="col-2">
            <ProductRows :total="total" :options="[ 4]" v-model="rows" @rows-change="callFind">
            </ProductRows>
        </div>
    </div>
    <br>
    
    <div class="row">
        <ProductCard v-for="product in products" :key="product.id" :product="product" 
                    @custom-open="openModal" @custom-delete="callRemove">
        </ProductCard>
    </div>

    <div class="pagination-container">
    <div class="row">
      <div class="col-8" v-show="total!=0">
        <Paginate 
          class="paginate"
          :first-last-button="true"
          first-button-text="第一頁"
          last-button-text="最後一頁"
          prev-text="&lt;"
          next-text="&gt;"
          :page-count="pages"
          :initial-page="current"
          v-model="current"
          :click-handler="callFind">
        </Paginate>
      </div>
    </div>
  </div>

    <ProductUpload ref="productUploadModal"  @showUploadOver="callFind">
    </ProductUpload>

    <ProductModal ref="productModal" :is-show-insert-button="isShowInsertButton" v-model="product"
    @customUpdate="callFind">
    </ProductModal>
</div>
</template>

<script setup>
    import axiosapi from '@/plugins/axios.js';
    import Swal from 'sweetalert2';
    import Paginate from 'vuejs-paginate-next';
    import ProductCard from '@/components/ProductCard.vue';
    import ProductRows from '@/components/ProductRows.vue';
    import ProductModal from '@/components/ProductModal.vue';
    import ProductUpload from '@/views/pages/ProductUpload.vue'
    import ProductSelect from '@/components/ProductSelect.vue';
    import { ref, onMounted } from 'vue';


    //分頁 start
    const total = ref(0);   //總資料筆數
    const pages = ref(0);   //總共頁數
    const current = ref(0); //目前頁碼
    const rows = ref(3);    //最多抓幾筆資料
    const start = ref(0);   //從哪裡開始抓資料
    const lastPageRows = ref(0)
    //分頁 end

    const findName = ref("");
    const findGender = ref("");
    const findType = ref(""); 
    const findStyle = ref("");

    const isShowInsertButton = ref(false);
    const products = ref([ ]);
    const product = ref({ });
    const productModal = ref(null);
    const productUploadModal = ref(null);
    onMounted(function() {
        callFind();
    });

    function openUploadModal() {
            productUploadModal.value.showUploadModal();

    }

    function openModal(action, id) {
        if(action==='insert') {
            isShowInsertButton.value = true;
            product.value = { };
        } else {
            isShowInsertButton.value = false;
            callFindById(id);
        }
        productModal.value.showModal();

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
                    axiosapi.delete("/backstage/product/delete/"+id).then(function(response) {
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

        axiosapi.get(`/backstage/product/${id}`).then(function(response) {
            product.value = response.data.list[0];

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

    const handleSelection = (selection) => {
        findGender.value = selection.gender;
        findType.value = selection.type;
        findStyle.value = selection.style;
        callFind(1);
    };

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
        if(findGender.value==="") {
            findGender.value = null;
        }
        if(findType.value==="") {
            findType.value = null;
        }
        if(findStyle.value==="") {
            findStyle.value = null;
        }
        let request = {
            "start": start.value,
            "max": rows.value,
            "dir": true,
            "order": "id",
            "name": findName.value,
            "gender": findGender.value,
            "type": findType.value,
            "style": findStyle.value,
        };
        axiosapi.post("/backstage/product/find", request).then(function(response) {
            products.value = response.data.list;

            total.value = response.data.count;
            pages.value = Math.ceil(total.value / rows.value);
            lastPageRows.value = total.value % rows.value;

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
.pro{
    background-color: #ccc;
}

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
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px; /* 顶部外边距 */
}

.row {
  display: flex;
  justify-content: center;
  width: 100%; /* 确保容器占满宽度 */
}

.col-8 {
  display: flex;
  justify-content: center;
  width: 100%; /* 确保分页组件在列内居中 */
}

.paginate {
  display: flex;
  list-style: none;
  padding: 0;
  gap: 10px;
}

.paginate li {
  display: inline;
}

.paginate li a {
  display: block;
  padding: 8px 12px;
  border: 1px solid #ddd;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
  white-space: nowrap; /* 防止文本换行 */
  min-width: 40px; /* 设置最小宽度，以确保按钮不会被挤扁 */
  text-align: center; /* 使文本居中 */
}

.paginate li a:hover {
  background-color: #ffae00; /* 主色调的浅色 */
  color: white;
}

.paginate li.disabled a {
  color: #ccc;
}

.paginate li.active a {
  background-color: black; /* 主色调的深色 */
  color: white;
  border-color: black; /* 边框颜色与活动按钮背景色一致 */
}
</style>
 