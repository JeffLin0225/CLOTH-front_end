<template>
<div ref="exampleRef" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-7" id="exampleModalLabel"><strong>JST後端登入系統</strong></h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>                   
                <div class="modal-body">                             
                    <div class="mb-3">
                    <label for="username" class="form-label"><strong>使用者名稱</strong></label>
                    <input type="text" name="username" class="form-control" id="username" v-model="username">
                    </div>
                    <div class="mb-3">
                    <label for="password" name="password" class="form-label"><strong>密碼</strong></label>
                    <input type="password" class="form-control" id="password" v-model="password">
                    </div>

                    <div class="d-grid gap-2">
                    <button type="button" class="btn btn-dark" @click="login">Login</button>
                    </div>                              
                </div>                  
             </div>
        </div>
</div>

</template>
    
<script setup>
    import Swal from 'sweetalert2';
    import axiosapi from '../plugins/axios.js';
    // import { defineExpose } from 'vue';
    const exampleRef = ref(null);
    const exampleModal = ref(null);
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    const username = ref("");
    const password = ref("");
    const router = useRouter();
    import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"
    import { inject } from 'vue';
    const setUsername = inject('setUsername')
    const setUserid = inject('setUserid')
    const setUserauthority = inject('setUserauthority')


    function login() {
        axiosapi.defaults.headers.authorization = "";
        sessionStorage.clear();

        Swal.fire({
            text: "執行中......",
            allowOutsideClick: false,
            showConfirmButton: false,
        });
        if(username.value=="") {
            username.value = null;
        }
        if(password.value=="") {
            password.value = null;
        }
        let request = {
            "username": username.value,
            "password": password.value
        };

        axiosapi.post("/backstage/secure/login", request).then(function(response) {
            console.log("response", response);
            if(response.data.success) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    showConfirmButton:false,
                    timer: 1000,
                }).then(function(result) {

                    sessionStorage.setItem("id",response.data.id);
                    sessionStorage.setItem("username",response.data.username);
                    sessionStorage.setItem("authority", response.data.authority);
                    setUsername(response.data.username);
                    setUserid(response.data.id);
                    setUserauthority(response.data.authority);

                    hideModal();

                    axiosapi.defaults.headers.authorization = `Bearer ${response.data.token}`;

                    router.push("/");
                    // .then(()=>{window.location.reload();}); 
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
                text: "登入錯誤："+error.message,
            });
        });
    }


    onMounted(function() {
        exampleModal.value = new bootstrap.Modal(exampleRef.value);
        showModal()
    });

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
    
<style scoped>
    .modal-content {
  border-radius: 0.5rem;
}
</style>