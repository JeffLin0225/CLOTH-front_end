<template>
    <div ref="exampleeRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h3>新增商品</h3>
            <table class="table table-bordered">
              <tr>
                <td>商品名稱 :</td>
                <td><input type="text" id="name" name="name" v-model="name" class="form-control"></td>
              </tr>
              <tr>
                <td>描述 :</td>
                <td><input type="text" id="description" name="description" v-model="description" class="form-control"></td>
              </tr>
              <tr>
                <td>數量 :</td>
                <td><input type="number" id="quantity" name="quantity" v-model="quantity" class="form-control"></td>
              </tr>
              <tr>
                <td>尺寸 :</td>
                <td>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="sizeSmall" name="size" value="S" v-model="selectedSize" class="form-check-input">
                    <label for="sizeSmall" class="form-check-label">S</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="sizeMedium" name="size" value="M" v-model="selectedSize" class="form-check-input">
                    <label for="sizeMedium" class="form-check-label">M</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="sizeLarge" name="size" value="L" v-model="selectedSize" class="form-check-input">
                    <label for="sizeLarge" class="form-check-label">L</label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>價格 :</td>
                <td><input type="number" id="price" name="price" v-model="price" class="form-control"></td>
              </tr>
              <tr>
                <td>活動 :</td>
                <td>
                  <select v-model="selectedActivityId" @change="updateDiscountPrice" class="form-select">
                    <option v-for="activity in activities" :key="activity.id" :value="activity.id">
                      <template v-if="activity.discount_percent == null">{{ activity.name }}</template>
                      <template v-else>{{ activity.name }} - {{ calculateDiscountText(activity.discount_percent) }}</template>
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>折扣後價格 :</td>
                <td><input type="number" id="discount_price" name="discount_price" v-model="discount_price" class="form-control" readonly></td>
              </tr>
              <tr>
                <td>顏色 :</td>
                <td>          
                  <div class="form-check form-check-inline">
                    <input type="radio" id="colorkhaki" name="color" value="藍色" v-model="selectedColor" class="form-check-input">
                    <label for="colorkhaki" class="form-check-label khaki">藍色</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="colorWhite" name="color" value="白色" v-model="selectedColor" class="form-check-input">
                    <label for="colorWhite" class="form-check-label white">白色</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="colorBlack" name="color" value="黑色" v-model="selectedColor" class="form-check-input">
                    <label for="colorBlack" class="form-check-label black">黑色</label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>類型 :</td>
                <td>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="Type1" name="type" value="上衣" v-model="selectedType" class="form-check-input">
                    <label for="Type1" class="form-check-label">上衣</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="Type2" name="type" value="下身" v-model="selectedType" class="form-check-input">
                    <label for="Type2" class="form-check-label">下身</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="Type3" name="type" value="聯名T" v-model="selectedType" class="form-check-input">
                    <label for="Type3" class="form-check-label">聯名T</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="Type4" name="type" value="牛仔褲" v-model="selectedType" class="form-check-input">
                    <label for="Type4" class="form-check-label">牛仔褲</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="Type5" name="type" value="外套" v-model="selectedType" class="form-check-input">
                    <label for="Type5" class="form-check-label">外套</label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>性別 :</td>
                <td>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="Gendermale" name="gender" value="男裝" v-model="selectedGender" class="form-check-input">
                    <label for="Gendermale" class="form-check-label">男裝</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="Genderfemale" name="gender" value="女裝" v-model="selectedGender" class="form-check-input">
                    <label for="Genderfemale" class="form-check-label">女裝</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="Genderkid" name="gender" value="童裝" v-model="selectedGender" class="form-check-input">
                    <label for="Genderkid" class="form-check-label">童裝</label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>風格 :</td>
                <td>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="styleBusiness" name="style" value="宅家舒適" v-model="selectedStyle" class="form-check-input">
                    <label for="styleBusiness" class="form-check-label">宅家舒適</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="styleCasual" name="style" value="運動精選系列" v-model="selectedStyle" class="form-check-input">
                    <label for="styleCasual" class="form-check-label">運動精選系列</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input type="radio" id="styleSporty" name="style" value="職場穿搭推薦" v-model="selectedStyle" class="form-check-input">
                    <label for="styleSporty" class="form-check-label">職場穿搭推薦</label>
                  </div>
                  
                </td>
              </tr>
            </table>

            <div class="form-group">
            <tr>
                <td>商品圖片：</td>
                <td>
                    <FileUpload class="btn btn-light"	accept="imge/*"
                                input-id="filess" input-name="filess" v-model="filess"
                                :multiple="true">
                        選擇圖片
                    </FileUpload>
                </td>
            </tr>
            <span v-for="(file, index) in filess" :key="file.id">
                <td></td>
                <td>{{ file.name }}</td>
                <td><input type="button" value="刪除檔案" @click="deleteFile(file.id)"></td>
            </span>           
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" @click="domultiple()">確認新增</button> 
            </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
    const props = defineProps(["isShowUploadModel", "modelValue"]);
    const emits = defineEmits([ "showUploadOver" , "update:modelValue"])

    const exampleeRef = ref(null);
    const exampleeModal = ref(null);

    import axiosapi from '@/plugins/axios.js';
    import Swal from 'sweetalert2';
    import FileUpload from 'vue-upload-component'
    import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"

    import { ref, onMounted ,watch} from 'vue';
    const activities = ref([]);

    const filess = ref([])
    const name = ref(null)
    const description = ref(null)
    const quantity = ref(null)
    const selectedActivityId= ref(null)
    const price = ref(null)
    const discount_price = ref(null)
    const created_by = ref(null)
    const selectedSize = ref(null); 
    const selectedColor = ref(null);
    const selectedGender = ref(null);
    const selectedStyle = ref(null);
    const selectedType = ref(null);
    
    onMounted(() => {
        exampleeModal.value = new bootstrap.Modal(exampleeRef.value);

        axiosapi.get('/backstage/activity/findall')
        .then(response => {
            activities.value = response.data.activities; // 將活動資料賦值給 activities
        })
        .catch(error => {
            console.error("Error fetching activities:", error);
        });
    });

    // 監聽 selectedActivityId 的變化，更新折扣價格
    watch(selectedActivityId, (newVal, oldVal) => {
    updateDiscountPrice();
    });

    // 更新折扣價格的方法
    function updateDiscountPrice() {
    const selectedActivity = activities.value.find(activity => activity.id === selectedActivityId.value);
    
        if (selectedActivity) {
            if (selectedActivity.discount_percent === null || isNaN(selectedActivity.discount_percent)) {
                discount_price.value=price.value
                } 
            else{
                if(selectedActivity.discount_percent<10){
                discount_price.value = price.value * ( selectedActivity.discount_percent/10);
                discount_price.value= Math.round(discount_price.value)}
                else{
                    discount_price.value = price.value * ( selectedActivity.discount_percent/100);
                discount_price.value= Math.round(discount_price.value)
                }
            }
        }else {
                    discount_price.value = 0;
                }
    }

// 根據折扣比例計算展示文本
function calculateDiscountText(percent) {
  return (percent < 10 ) ? `${percent }折` : `${percent  }折`;
}

    function validate(selected) {
        console.log("selected", selected)
        if (selected.length == 0) {
            alert("請選擇檔案");
            return false;
        }
        for (let i = 0; i < selected.length; i++) {
            let uploadFile = selected[0];
            if (uploadFile.size > 10000000) {
                alert("檔案大小超出限制(10M)");
                return false;
            }
        }
        return true;
    }

    let user = sessionStorage.getItem("username");
    if (!user) {
        user = "";
    }
    function domultiple() {
        if (!validate(filess.value)) {
            filess.value = [];
            return;
        }
        // 利用File物件產生上傳用的HTML Form資料
        let formData = new FormData();
        for(let i = 0; i < filess.value.length; i++) {
            formData.append("filess", filess.value[i].file);
        }
        formData.append("name", name.value);
        formData.append("description", description.value);
        formData.append("activity", selectedActivityId.value);
        formData.append("quantity", quantity.value);
        formData.append("size", selectedSize.value);
        formData.append("price", price.value);
        formData.append("discount_price", discount_price.value);
        formData.append("color", selectedColor.value);
        formData.append("type", selectedType.value);
        formData.append("gender", selectedGender.value);
        formData.append("style", selectedStyle.value);
        formData.append("created_by", user);
        console.log("formData", formData);


            axiosapi.post('/backstage/product/create', formData)
            .then(response => {
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        text: response.data.message,
                    }).then(() => {
                        emits('showUploadOver');
                        hideUploadModal()
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        text: response.data.message,
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    text: '新增錯誤：' + error.message,
                });
            });
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

    function showUploadModal() {
        exampleeModal.value.show();
    }
    function hideUploadModal() {
        exampleeModal.value.hide();
    }

    defineExpose({
        showUploadModal, hideUploadModal,
    });


</script>

<style>
.table-bordered td {
  width: 50%;
  vertical-align: middle;
}

.color-label {
    display: inline-block;
    /* 調整內邊距以確保內容不會貼太近 */
    
    text-align: center;
    cursor: pointer; /* 添加指標以顯示該元素可點擊 */
}

.white {
    background-color: white;
    color: white /* 文字顏色 */;
    border: 1px black solid;
    
}
.blue {
    background-color: blue;
    color: blue ;/* 文字顏色 */
}
.black {
    background-color: black;
    color: black /* 文字顏色 */
}
.gray {
    background-color: gray;
    color: gray /* 文字顏色 */
}
.khaki {
    background-color: blue;
    color: blue /* 文字顏色 */
}
</style>
