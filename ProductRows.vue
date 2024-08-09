<template>
    <div style="font-size: 25px;">
        <template v-if="total===0"><p>查無商品</p></template>
        <template v-else><p>{{ total }}筆<strong>商品資訊</strong></p></template>
        
        
    </div>
    <!-- <select :value="modelValue" @change="dochange">
            <option v-for="option in options" :key="option" :value="option">{{option}}</option>
        </select>筆 -->
</template>

<script setup>
    const props = defineProps(["total", "options", "modelValue"]);
    const emits = defineEmits(["update:modelValue", "rowsChange"]);
    function dochange(event) {
        emits('update:modelValue', event.target.value);
        emits('rowsChange')
    }
    
</script>

<style>

</style>