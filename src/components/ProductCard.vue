<template>
    <div class="col-lg-3 col-md-6" >
        <div class="card" >
            <h3></h3>
            <div class="image-container">
                <br>  
            <span class="main-image">
            <img :src="`${path1}${product.id}`" :alt="product.name">
            </span>
            <div class="thumbnail-container">
            <span class="thumbnail">
                <img  :src="`${path2}${product.id}`" :alt="product.name">
            </span>
            <span class="thumbnail">
                <img  :src="`${path3}${product.id}`" :alt="product.name">
            </span>
            <span class="thumbnail">
                <img  :src="`${path4}${product.id}`" :alt="product.name">
            </span>
        </div>
    </div>
            <div class="card-body">
                <h3 class="card-title">{{product.name}}</h3>
                <hr>
                <div class="card-text  text-start"><strong>描述:</strong> {{product.description}}</div>
                <hr>
                <template  v-if="product.price!=product.discount_price">
                <div  class="card-text  text-start" style="text-decoration: line-through;"><strong>價格:</strong> NT$ {{product.price}}</div>
                <div  class="card-text text-danger text-start" ><strong>活動價:</strong> NT$ {{product.discount_price}}</div>
                </template>
                <template  v-else>
                <div  class="card-text  text-start"><strong>價格:</strong> NT$ {{product.price}}</div>
                <div  class="card-text text-danger text-start" style="text-decoration: line-through;">沒有特價 </div>
                </template>
                <div class="card-text  text-start" ><strong>尺寸:</strong> {{product.size }} </div>
                <div class="card-text  text-start" ><strong>顏色:</strong> {{product.color }} </div>
                <div class="card-text  text-start"> <strong>數量:</strong> {{product.quantity}}</div>
                <div v-if="product.quantity== 0" class="card-text text-danger text-start" style="text-decoration:underline"> <strong>狀態:</strong> {{product.status}}</div>
                <div v-else class="card-text  text-start"> <strong>狀態:</strong> {{product.status}}</div>
                <div class="card-text  text-start"> <strong>性別:</strong> {{product.gender}}</div>
                <div class="card-text  text-start"> <strong>類型:</strong> {{product.type}}</div>
                <div class="card-text  text-start"> <strong>風格:</strong> {{product.style}}</div>
                <div v-if="product.created_by!=null" class="card-text  text-start"> <strong>上架者:</strong> {{product.created_by}}</div>
                <div v-if="product.updated_by!=null" class="card-text  text-start"> <strong>修改者:</strong> {{product.updated_by}}</div>
                <div v-else class="card-text text-danger  text-start"> <strong>修改者:</strong> <span style="text-decoration:underline">目前沒有</span></div>
                <hr>
                <div class="row">
                    <div class="col text-start">
                        <a href="#" class="btn btn-outline-success" @click="emits('customOpen', 'update', product.id)">開啟修改</a>
                    </div>
                    <div class="col text-end">
                        <a href="#" class="btn btn-outline-danger" @click="emits('customDelete', product.id)">刪除</a>
                    </div>
                </div>
            </div>
        </div>
        <br>
    </div>
</template>
    
<script setup>
    const props = defineProps(["product"]);
    const emits = defineEmits(["customOpen", "customDelete"]);
    const path1 = import.meta.env.VITE_PHOTO_API1;
    const path2 = import.meta.env.VITE_PHOTO_API2;
    const path3 = import.meta.env.VITE_PHOTO_API3;
    const path4 = import.meta.env.VITE_PHOTO_API4;
</script>

<style scoped >
.card {
  margin: 5px; /* 卡片之間的間距 */
  border: 1px solid #ddd; /* 卡片邊框 */
  border-radius: 8px; /* 圓角邊框 */
  padding: 15px; /* 卡片內部的間距 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); /* 添加輕微的陰影效果 */
  background-color: #fff; /* 卡片背景顏色 */
}

.image-container {
  display: flex;
  gap: 10px;
}

.main-image {
  flex: 2;
}

.thumbnail-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  flex: 1;
}

.thumbnail {
  flex: 1;
}

.main-image img, .thumbnail img {
  width: 100%;
  height: auto;
  display: block;
}

.thumbnail img {
  width: 80px; /* 調整縮略圖的寬度，使其更小 */
  height: 80px; /* 使縮略圖高度與寬度一致 */
  object-fit: cover; /* 保持圖片比例 */
}

</style>