<template>
  <div>
    <div class="activity-container">
      <div class="activity-row">
         <h3><font-awesome-icon :icon="['fas', 'ticket']" /></h3> 

        <div class="activity-info">
          <h5 class="activity-name"><strong>{{ coupon.name }}</strong></h5>
          <div v-if="coupon.discount == null" class="activity-discount">無折價卷</div>
          <div v-else class="activity-discount">折價幅度: {{ coupon.discount }}</div>
        </div>
        <div class="activity-description">
          <strong>描述: </strong>{{ coupon.description }}
        </div>
        <div v-if="coupon.start_at != coupon.end_at" class="activity-time">
          活動時間: <br>{{ coupon.start_at }} <br> {{ coupon.end_at }}
        </div>
        <div class="activity-meta">
          <div class="meta-info">
            <div v-if="coupon.created_by != null" class="meta-value">上架者: {{ coupon.created_by }}</div>
            <div v-if="coupon.updated_by != null" class="meta-value">更新者: {{ coupon.updated_by }}</div>
          </div>
        </div>
        <div class="activity-actions">
          <a href="#" class="btn btn-outline-success" @click="emits('customOpen', 'update', coupon.id)">修改</a>
          <a href="#" class="btn btn-outline-danger" @click="emits('customDelete', coupon.id)">刪除</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["coupon"]);
const emits = defineEmits(["customOpen", "customDelete"]);
</script>

<style scoped>
.activity-container {
  margin-bottom: 20px;
  max-width: 1000px; /* 限制卡片最大宽度 */
  margin: 20px auto; /* 居中显示 */
  padding: 15px; /* 添加内边距 */
  border: 1px solid #ddd; /* 边框 */
  border-radius: 8px; /* 圆角 */
  background-color: #f0e8be; /* 背景色 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); /* 添加阴影 */
}

.activity-row {
  display: flex;
  flex-wrap: nowrap; /* 不允许换行 */
  align-items: center; /* 垂直居中对齐 */
  gap: 20px; /* 项目之间的间距 */
}

.activity-info {
  flex: 2;
}

.activity-description {
  flex: 3;
}

.activity-time {
  flex: 2;
  font-size: 1.125rem;
  color: #4f5dd9; /* 活动时间颜色 */
}

.activity-meta {
  flex: 2;
}

.activity-actions {
  flex: 2;
  display: flex;
  gap: 10px; /* 按钮之间的间距 */
  justify-content: flex-end; /* 按钮右对齐 */
}

.activity-name {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
}

.activity-discount {
  color: #d9534f;
  font-size: 1.125rem;
}

.activity-description strong {
  font-weight: bold;
}

.meta-info {
  font-size: 1.25rem; /* 字体大小 */
  color: #666; /* 字体颜色 */
}

.meta-value {
  font-weight: bold; /* 文字加粗 */
  color: #333; /* 字体颜色 */
}

.meta-separator {
  margin: 0 5px; /* 分隔符的间距 */
}

.activity-actions a {
  font-size: 1.125rem;
  min-width: 80px;

  text-decoration: none; /* 去掉下划线 */
}
</style>
