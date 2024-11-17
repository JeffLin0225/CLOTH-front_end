<template>
  <div class="popup-selector-container">
    <!-- 触发弹出视窗的区域 -->
    <div class="trigger-area" @mouseenter="showPopup" @mouseleave="hidePopup">
      <button class="trigger-button"   ><strong>條件篩選</strong></button>
      <!-- 弹出视窗 -->
      <div v-if="isVisible" class="popup">
        <div class="popup-header">
          <h4><strong>條件篩選</strong></h4>
          <button class="close-button" @click="hidePopup">×</button>
        </div>
        <div class="popup-body">
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" id="gendermale" name="gender" value="男裝" v-model="selectedGender" @change="emitSelection">
              <label for="gendermale">男裝</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="genderfemale" name="gender" value="女裝" v-model="selectedGender" @change="emitSelection">
              <label for="genderfemale">女裝</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="genderkid" name="gender" value="童裝" v-model="selectedGender" @change="emitSelection">
              <label for="genderkid">童裝</label>
            </div>
          </div>
          <div class="line"></div>
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" id="type1" name="type" value="上衣" v-model="selectedType" @change="emitSelection">
              <label for="type1">上衣</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="type2" name="type" value="下身" v-model="selectedType" @change="emitSelection">
              <label for="type2">下身</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="type3" name="type" value="聯名T" v-model="selectedType" @change="emitSelection">
              <label for="type3">聯名T</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="type4" name="type" value="牛仔褲" v-model="selectedType" @change="emitSelection">
              <label for="type4">牛仔褲</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="type5" name="type" value="外套" v-model="selectedType" @change="emitSelection">
              <label for="type5">外套</label>
            </div>
          </div>
          <div class="line2"></div>
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" id="style1" name="style" value="宅家舒適" v-model="selectedStyle" @change="emitSelection">
              <label for="style1">宅家舒適</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="style2" name="style" value="運動精選系列" v-model="selectedStyle" @change="emitSelection">
              <label for="style2">運動精選系列</label>
            </div>
            <div class="radio-item">
              <input type="radio" id="style3" name="style" value="職場穿搭推薦" v-model="selectedStyle" @change="emitSelection">
              <label for="style3">職場穿搭推薦</label>
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <button @click="clearSelection">清除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['selection-applied']);

const emitSelection = () => {
emit('selection-applied', {
  gender: selectedGender.value,
  type: selectedType.value,
  style: selectedStyle.value
});
};

// 状态管理
const isVisible = ref(false);
const selectedGender = ref('');
const selectedType = ref('');
const selectedStyle = ref('');

// 显示弹出视窗
const showPopup = () => {
isVisible.value = true;
};

// 隐藏弹出视窗
const hidePopup = () => {
isVisible.value = false;
};

// 清除选择
const clearSelection = () => {
selectedGender.value = '';
selectedType.value = '';
selectedStyle.value = '';
emitSelection();
};
</script>

<style scoped>
.popup-selector-container {
position: relative;
}

.trigger-area {
display: inline-block;
cursor: pointer;
}

.trigger-button {
padding: 12px 24px;
font-size: 18px;
background-color: #8b65f5;
color: white;
border: none;
border-radius: 6px;
cursor: pointer;
transition: background-color 0.3s;
}

.trigger-button:hover {
background-color: #0056b3;
}

.popup {
position: absolute;
top: 100%;
left: 0;
background-color: antiquewhite;
border: 1px solid #ddd;
box-shadow: 0 4px 12px rgba(0, 0, 0, 1);
width: 380px;
max-width: 500px;
z-index: 1000; /* 确保在最上层 */
border-radius: 8px;
padding: 20px;
}

.line {
border-top: 2px solid #104c8b;
padding-bottom: 20px;
}

.line2 {
border-top: 2px solid #0a3666;
padding-bottom: 20px;
}

.popup-header {
padding: 10px;
display: flex;
justify-content: space-between;
align-items: center;
}

.popup-body {
padding: 20px 0;
padding-bottom: 0;
}

.popup-footer {
padding: 10px;
text-align: right;
}

.close-button {
background: none;
border: none;
font-size: 20px;
color: #333;
cursor: pointer;
}

.radio-group {
display: flex;
flex-wrap: wrap;
gap: 20px;
margin-bottom: 20px;
}

.radio-item {
display: flex;
align-items: center;
gap: 10px;
}

.radio-item input[type="radio"] {
accent-color: #007bff;
width: 20px;
height: 20px;
}

.radio-item label {
cursor: pointer;
font-size: 20px;
color: #333;
font-weight: bolder;
}

.popup-footer button {
padding: 8px 16px;
font-size: 16px;
color: #fff;
background-color: #fc0921;
border: none;
border-radius: 6px;
cursor: pointer;
transition: background-color 0.3s;
}

.popup-footer button:hover {
background-color: #c82333;
}
</style>
