<template>
    <div class="select-module-main">
        <div class="select-module-item" style="background: #ff9b3a;" @click="enterInModule(1)">
            <div class="select-module-text">土地利用调查</div>
            <div class="select-module-text">Land Use Survey</div>
        </div>
        <div class="select-module-item" style="background: #4db0ff;" @click="enterInModule(2)">
            <div class="select-module-text">农业专题调查</div>
            <div class="select-module-text">Agricultural Special Survey</div>
        </div>
    </div>
</template>

<script>
// 土地利用1，专题2
export default {
    name: "Selectmodule",
    methods: {
        enterInModule(module) {
            this.$addin.module.setType(module);
            this.$emit("updateModule");
        }
    }
}
</script>

<style scoped>
.select-module-main {
    background: #50a6ff;
    opacity: 0.8;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
}
.select-module-main .select-module-item {
    flex: 1;
    background: #009688;
    padding: 50px 10px;
    box-sizing: content-box;
    height: 100%;
}
.select-module-main .select-module-item .select-module-text {
    text-align: center;
    height: 50%;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>