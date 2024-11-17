<template>
    <div style="font-size: 25px;">
        <template v-if="total === 0">
            <p class="no-activities"><strong>沒有折價卷</strong></p>
        </template>
        <template v-else>
            <p class="activity-count">{{ total }}筆<strong>折價卷</strong></p>
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