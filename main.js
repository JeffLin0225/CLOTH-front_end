import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import FontAwesomeIcon from "./plugins/fontawesome.js";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 确保引入ElementPlus的样式


createApp(App)
    .use(router)
    .use(ElementPlus)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount('#app')

