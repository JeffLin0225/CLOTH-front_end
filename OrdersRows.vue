<template>
    <div style="font-size: 25px;">
        <template v-if="total === 0">
            <p class="no-activities">沒有訂單</p>
        </template>
        <template v-else>
            <p class="activity-count">{{ total }}筆<strong>訂單資料</strong></p>
        </template>
    </div>

</template>

<script setup>
    const props = defineProps(["total"]);
    const emits = defineEmits(["update:modelValue"]);
    function dochange(event) {
        emits('update:modelValue', event.target.value);
        emits('rowsChange')
    }
    
</script>

<style scoped>


</style>