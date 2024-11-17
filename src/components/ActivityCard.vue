<template>
    <div>
      <div class="activity-container">
        <div class="activity-row">
         
          <div class="activity-info">
           <h5 class="activity-name"><font-awesome-icon :icon="['fas', 'tags']" />&nbsp;<strong>{{ activity.name }}</strong></h5>
            <div v-if="activity.discount_percent == null" class="activity-discount">無折價幅度</div>
            <div v-else class="activity-discount">折價幅度: {{ activity.discount_percent }}折</div>
          </div>
          <div v-if="activity.start_at != activity.end_at" class="activity-time">
            活動時間: {{ activity.start_at }} ~ {{ activity.end_at }}
          </div>
  
          <div class="activity-meta">
            <div class="meta-info"> <span class="meta-value" v-if="activity.created_by!=null">上架者:{{ activity.created_by }}</span>&emsp; <span v-if="activity.updated_by!=null" class="meta-value">更新者:{{ activity.updated_by }}</span></div>
          </div>
  
          <div class="activity-actions">
            <a href="#" class="btn btn-outline-success" @click="emits('customOpen', 'update', activity.id)">修改</a>
            <a href="#" class="btn btn-outline-danger" @click="emits('customDelete', activity.id)">刪除</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps(["activity"]);
  const emits = defineEmits(["customOpen", "customDelete"]);
  </script>
  
  <style scoped>
  .activity-container {
    max-width: 600px; /* 限制 card 最大宽度 */

    margin: 20px auto; /* 居中显示 */
    padding: 10px; /* 添加内边距 */
  }
  
  .activity-row {
    display: flex;
    flex-direction: column; /* 垂直排列 */
    padding: 15px; /* 内边距 */
    border: 1px solid #ddd; /* 边框 */
    border-radius: 8px; /* 圆角 */
    background-color: #dee9ee; /* 背景色 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); /* 添加阴影 */

  }
  
  .activity-info {

    margin-bottom: 10px; /* 信息与活动时间之间的间距 */
  }
  
  .activity-name {
    font-size: 1.5rem; /* 标题字体大小 */
    margin: 0; /* 取消外边距 */
    color: #333;
  }
  
  .activity-discount {
    color: #d9534f;
    font-size: 1.125rem; /* 字体大小 */
    text-align: center; /* 居中对齐 */
    margin: 5px 0; /* 上下外边距 */
  }
  
  .activity-time {
    color: #4f5dd9;
    font-size: 1.125rem; /* 字体大小 */
    text-align: center; /* 居中对齐 */
    margin: 5px 0; /* 上下外边距 */
  }
  
  .activity-meta {
    margin-top: 10px; /* 与其他信息的间距 */
    font-size: 1rem; /* 字体大小 */
    color: #666; /* 字体颜色 */
  }
  
  .meta-info {
    font-size: 1.25rem; /* 字体大小 */
    margin: 5px 0; /* 上下外边距 */
    text-align: center; /* 按钮居中对齐 */
  }
  
  .meta-value {
    font-weight: bold; /* 文字加粗 */
    color: #333; /* 文字颜色 */
  }
  
  .activity-actions {
    text-align: center; /* 按钮居中对齐 */
  }
  
  .activity-actions a {
    margin: 5px; /* 按钮之间的间距 */
    font-size: 1.125rem; /* 按钮字体大小 */
  }
  </style>
  