<template>
    <div ref="exampleRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Product</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table>
                        <tr hidden>
                            <td><input type="text" name="id" :value="modelValue.id" @input="doinput('id', $event)"></td>
                        </tr>
                        <tr>
                            <td>名稱 : </td>
                            <td><input type="text" name="name"  :value="modelValue.name" @input="doinput('name', $event)"></td>
                        </tr>
                        <tr>
                            <td>描述 : </td>
                            <td><input type="text" name="description" :value="modelValue.description" @input="doinput('description', $event)"></td>
                        </tr>
                        <tr>
                            <td>尺寸 : </td>
                            <td>
                            <select :value="modelValue.size" @change="doinput('size', $event)">
                            <option name="size" value="S">S</option>
                            <option name="size" value="M">M</option>
                            <option name="size" value="L">L</option>
                            </select>
                            </td>
                        </tr>
                        <tr>
                            <td>數量 : </td>
                            <td><input type="number" name="quantity" :value="modelValue.quantity" @input="doinput('quantity', $event)"></td>
                        </tr>
                        <tr>
                            <td>價格 : </td>
                            <td><input type="text" name="price" :value="modelValue.price" @input="doinput('price', $event)"></td>
                        </tr>
                        <tr>
                            <td>活動 : </td>
                            <select v-model="selectedActivityId">
                                <option  v-for="activity in activities" :key="activity.id" :value="activity.id" >
                                    <template v-if="activity.discount_percent == null || activity.discount_percent ==100" >
                                    {{ activity.name }}
                                    </template>
                                    <template v-else >
                                    {{ activity.name }} - {{ calculateDiscountText(activity.discount_percent) }}
                                    </template>
                                </option>
                            </select>
                        </tr>
                        <tr>
                            <td>折扣後價格 : </td>
                            <td><input type="text" name="discount_price" :value="modelValue.discount_price" @input="doinput('discount_price', $event)" readonly></td>
                        </tr>
                        <tr>
                            <td>狀態 : </td>
                            <td><input type="text" name="status" :value="modelValue.status" readonly></td>
                        </tr>
                        <tr>
                            <td>顏色 : </td>
                            <td>
                            <select :value="modelValue.color" @change="doinput('color', $event)">           
                            <option name="color" value="藍色" style="background-color: blue;">藍色</option>
                            <option name="color" value="白色" style="background-color: white;">白色</option>
                            <option name="color" value="黑色" style="background-color: black;color: white; " >黑色</option>
                            </select>
                            </td>
                        </tr>
                        <tr>
                            <td>類型 : </td>
                            <td><select  :value="modelValue.type" @change="doinput('type', $event)">
                            <option name="type" value="上衣" >上衣</option>
                            <option name="type" value="下身" >下身</option>
                            <option name="type" value="聯名T" >聯名T</option>
                            <option name="type" value="牛仔褲" >牛仔褲</option>
                            </select>
                            </td>
                        </tr>
                        <tr>
                            <td>風格 : </td>
                            <td><select  :value="modelValue.style" @change="doinput('style', $event)">
                            <option name="style" value="宅家舒適" >宅家舒適</option>
                            <option name="style" value="運動精選系列" >運動精選系列</option>
                            <option name="style" value="職場穿搭推薦" >職場穿搭推薦</option>
                            </select>
                            </td>
                        </tr>
                        <tr>
                            <td>性別 : </td>
                            <td>
                            <select :value="modelValue.gender" @change="doinput('gender', $event)">
                            <option name="gender" value="男裝" >男裝</option>
                            <option name="gender" value="女裝" >女裝</option>
                            <option name="gender" value="童裝" >童裝</option>
                            </select>
                            </td>
                        </tr>
                        <tr>
                            <td>上架者 : </td>
                            <td><input type="text" name="created_by" :value="modelValue.created_by" @input="doinput('created_by', $event)" readonly></td>
                        </tr>
                        <tr>
                            <td>上次修改者 : </td>
                            <td><input type="text" name="updated_by"  :value="modelValue.updated_by" @input="doinput('updated_by', $event)" readonly ></td>
                        </tr>
                        <tr>
                            <td>圖片：</td>
                            <td>
                                <FileUpload class="btn btn-light"	accept="imge/*"
                                            input-id="files" input-name="files" v-model="files"
                                            :multiple="true">
                                    選擇圖片
                                </FileUpload>
                            </td>
                        </tr>
                        <tr v-for="(file, index) in files" :key="file.id">
                            <td></td>
                            <td>{{ file.name }}</td>
                            <td><input type="button" value="刪除檔案" @click="deleteFile(file.id)"></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    
                    <button type="button" class="btn btn-primary" v-show="!isShowInsertButton" @click="callModify">修改</button>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup>
    const props = defineProps(["isShowInsertButton", "modelValue"]);
    const emits = defineEmits([ "customUpdate" , "update:modelValue"])
    import FileUpload from 'vue-upload-component'
    import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"
    import axiosapi from '@/plugins/axios.js';
    import Swal from 'sweetalert2';
    import { ref, onMounted ,computed ,watch} from 'vue'
    import { useRouter } from 'vue-router';
    const router = useRouter();


    const files = ref([])
    const activities = ref(null)

    function doinput(key, event) {
        emits('update:modelValue', {
            ...props.modelValue,
            [key]: event.target.value
        });
    }
    const exampleRef = ref(null);
    const exampleModal = ref(null);
    
 const selectedActivityId= ref(null)
    

    watch(selectedActivityId, (newVal, oldVal) => {
    updateDiscountPrice();
    });
    function updateDiscountPrice() {
    if (!activities.value || !selectedActivityId.value) {
        return;
    }
    
    const selectedActivity = activities.value.find(activity => activity.id === selectedActivityId.value);
    if(selectedActivity.discount_percent==null){
        selectedActivity.discount_percent=100;
    }
        if (selectedActivity) {
            if(selectedActivity.discount_percent<10){
            emits('update:modelValue', {
                ...props.modelValue,
                discount_price: Math.round(props.modelValue.price * selectedActivity.discount_percent/10),
            });
            }else{
                emits('update:modelValue', {
                ...props.modelValue,
                discount_price: Math.round(props.modelValue.price * selectedActivity.discount_percent/100),
            });
            }
        } else {
            emits('update:modelValue', {
                ...props.modelValue,
                discount_price: 0, // or any default value you prefer
            });
        }
    }
     
    function calculateDiscountText(percent) {
        return (percent < 10 ) ? `${percent }折` : `${percent  }折`;
    }

    onMounted(function() {
        exampleModal.value = new bootstrap.Modal(exampleRef.value);

        axiosapi.get('/backstage/activity/findall')
        .then(response => {
            activities.value = response.data.activities; // 將活動資料賦值給 activities
        })
        .catch(error => {
            console.error("Error fetching activities:", error);
        });
    });
    

    let user = sessionStorage.getItem("username");
    if (!user) {
        user = "";
    }
    function callModify() {
        let formData = new FormData();
        // 添加文件到 FormData
        for (let i = 0; i < files.value.length; i++) {
            formData.append("files", files.value[i].file);
        }
        // 添加其他表单数据到 FormData
        formData.append("id", props.modelValue.id);
        formData.append("name", props.modelValue.name);
        formData.append("description", props.modelValue.description);
        formData.append("activity", selectedActivityId.value);
        formData.append("quantity", props.modelValue.quantity);
        formData.append("size", props.modelValue.size);
        formData.append("price", props.modelValue.price);
        formData.append("discount_price", props.modelValue.discount_price);
        formData.append("color", props.modelValue.color);
        formData.append("type", props.modelValue.type);
        formData.append("gender", props.modelValue.gender);
        formData.append("style", props.modelValue.style);
        formData.append("created_by", props.modelValue.created_by);
        formData.append("updated_by", user);
        axiosapi.put(`/backstage/product/modify/${props.modelValue.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
                // 可能还需要其他的头部设置，如授权头部等
            }
        }).then(function(response) {
            console.log("formData++++", formData);
            console.log("response", response);
            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                }).then(function(result) {
                    emits('customUpdate');
                    hideModal();
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
                text: "修改错误：" + error.message,
            });
        });
    }

    function deleteFile(id) {
        for (let i = 0; i < files.value.length; i++) {
            if (files.value[i].id === id) {
                files.value.splice(i, 1);
                break;
            }
        }
        console.log("files.value", files.value);
    }


    function showModal() {
        exampleModal.value.show();
    }
    function hideModal() {
        exampleModal.value.hide();
    }

    defineExpose({
        showModal, hideModal,
    });
</script>
    
<style scoped >
    /* 确保表格的宽度与模态框一致 */
table {
    width: 100%;
    margin-bottom: 1rem;
}

/* 设置每个表格单元格的对齐方式 */
td {
    vertical-align: middle;
    padding: 0.5rem;
}

/* 调整输入框和选择框的宽度 */
input[type="text"],
input[type="number"],
select {
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
}

/* 设置按钮的风格 */
.btn-light {
    color: #212529;
    background-color: #f8f9fa;
    border-color: #f8f9fa;
}

.btn-light:hover {
    color: #212529;
    background-color: #e2e6ea;
    border-color: #dae0e5;
}
/* 颜色选择框样式 */
select[name="color"] option {
    padding: 0.5rem;
    color: white;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

/* 各种颜色的背景色 */
option[value="灰色"] {
    background-color: gray;
}

option[value="藍色"] {
    background-color: blue;
}

option[value="白色"] {
    background-color: white;
}

option[value="黑色"] {
    background-color: black;
    color: white;
}
/* 文件上传按钮样式 */
.btn-file {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    padding: 0.375rem 0.75rem;
}

.btn-file input[type="file"] {
    display: none;
}
/* 模态框标题 */
.modal-title {
    font-size: 1.25rem;
    font-weight: 500;
}

/* 模态框内容 */
.modal-body {
    padding: 1.5rem;
}

/* 模态框按钮 */
.modal-footer .btn {
    margin: 0 0.25rem;
}

</style>