<template>
    <div class="container">
      <h3 class="my-4">評論列表</h3>
  
      <!-- 日期選擇器和未回覆篩選 -->
      <div class="filters mb-4">
        <div class="d-flex align-items-center">
          <label for="dateFilter" class="me-2">選擇日期:</label>
          <input type="date" id="dateFilter" v-model="selectedDate" @change="filterComments" class="form-control me-3" style="max-width: 200px;">
          
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="unrepliedFilter" v-model="showUnreplied" @change="filterComments">
            <label class="form-check-label" for="unrepliedFilter">
              尚未回覆
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="repliedFilter" v-model="showReplied" @change="filterComments">
            <label class="form-check-label" for="repliedFilter">
              已回覆
            </label>
          </div>
        </div>
      </div>
  
      <div v-if="filteredComments.length" class="list-group">
        <div v-for="comment in filteredComments" :key="comment.id" class="list-group-item">
          <div class="d-flex justify-content-between align-items-start">
            <div class="d-flex align-items-start flex-grow-1">
              <div v-if="comment.img">
                <img :src="`data:image/jpeg;base64,${comment.img}`" alt="Product Image" class="product-image mr-3">
              </div>
              <div class="comment-content">
                <strong>使用者: {{ comment.username }}</strong>
                <div>產品名稱: {{ comment.productName }}</div>
                評論內容: {{ comment.comments }}
                <div>星級評分: {{ comment.star }}</div>
                <div class="text-muted">建立時間: {{ formatDate(comment.updatedAt) }}</div>
              </div>
            </div>
            <div>
              <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                選擇操作
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li v-if="!comment.reply">
                  <a class="dropdown-item" href="#" @click="showReplyModal(comment)">回覆</a>
                </li>
                <li v-if="comment.reply">
                  <a class="dropdown-item" href="#" @click="showEditModal(comment.reply)">編輯回覆</a>
                </li>
                <li v-if="comment.reply">
                  <a class="dropdown-item" href="#" @click="showDeleteModal(comment.reply, comment)">刪除回覆</a>
                </li>
                <li>
                  <a class="dropdown-item" @click="deleteComment(comment.id)">刪除評論</a>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="comment.reply" class="reply-container">
            <div class="reply-content">
              <strong>管理員: {{ comment.reply.adminUsername }}</strong>
              <div>回復:{{ comment.reply.replies }}</div>
              <div>日期:{{ formatDate(comment.reply.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        暫無評論
      </div>
  
      <!-- Reply Modal -->
      <div class="modal fade" id="replyModal" tabindex="-1" aria-labelledby="replyModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="replyModalLabel">回覆評論</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <textarea v-model="replyContent" class="form-control" placeholder="輸入回覆內容"></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
              <button type="button" class="btn btn-primary" @click="replyToComment">提交回覆</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Edit Modal -->
      <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">編輯回覆</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <textarea v-model="editContent" class="form-control" placeholder="編輯回覆內容"></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
              <button type="button" class="btn btn-primary" @click="editReply">提交編輯</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Delete Modal -->
      <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteModalLabel">刪除回覆</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              確定要刪除這個回覆嗎？
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
              <button type="button" class="btn btn-danger" @click="deleteReply">確定刪除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import axiosapi from '@/plugins/axios.js';
  import { ref  } from 'vue'
  import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
  import Swal from 'sweetalert2';
  import moment from 'moment';
  // const showReplied =ref(null);
  let user = sessionStorage.getItem("id");
    if (!user) {
        user = "";
    }
  
  export default {
    data() {
      return {
        comments: [],
        filteredComments: [],
        replyContent: '',
        editContent: '',
        selectedComment: null,
        selectedReply: null,
        selectedDate: '',
        showUnreplied: false,
      }
    },
    methods: {
      formatDate(dateString) {
        return moment(dateString).format('YYYY-MM-DD HH:mm:ss');
      },
      fetchComments() {
        axiosapi.get('/backstage/comments/all')
          .then(response => {
            this.comments = response.data;
            this.comments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            return axiosapi.get('/backstage/replies/all');
          })
          .then(response => {
            const replies = response.data;
            this.comments.forEach(comment => {
              comment.reply = replies.find(reply => reply.commentId === comment.id) || null;
            });
            this.filterComments();
          })
          .catch(error => {
            console.error("There was an error fetching the comments or replies!", error);
          }); 
      },
      filterComments() {
        this.filteredComments = this.comments.filter(comment => {
          const isDateMatch = this.selectedDate ? moment(comment.updatedAt).isSame(this.selectedDate, 'day') : true;
          const isUnrepliedMatch = this.showUnreplied && !comment.reply;
          const isRepliedMatch = this.showReplied && comment.reply;
          return isDateMatch && (isUnrepliedMatch || isRepliedMatch || (!this.showUnreplied && !this.showReplied));
        });
      },
      showReplyModal(comment) {
        this.selectedComment = comment;
        this.replyContent = '';
        const modal = new bootstrap.Modal(document.getElementById('replyModal'));
        modal.show();
      },
      showEditModal(reply) {
        this.selectedReply = reply;
        this.editContent = reply.replies;
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
      },
      showDeleteModal(reply, comment) {
        this.selectedReply = reply;
        this.selectedComment = comment;
        Swal.fire({
          title: '確認刪除',
          text: '您確定要刪除這個回覆嗎？',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '刪除',
          cancelButtonText: '取消'
        }).then((result) => {
          if (result.isConfirmed) {
            this.deleteReply();
          }
        });
      },
      replyToComment() {
        console.log(user);
        const replyDTO = {
          replies: this.replyContent,
          adminId: user, // 假設當前管理員ID為2
          commentId: this.selectedComment.id
        };axiosapi.post('/backstage/replies/add', replyDTO)
          .then(response => {
            Swal.fire('成功!', '回覆已提交', 'success');
            this.fetchComments();
            const modal = bootstrap.Modal.getInstance(document.getElementById('replyModal'));
            modal.hide();
          })
          .catch(error => {
            console.error("There was an error submitting the reply!", error);
            Swal.fire('錯誤', '提交回覆失敗', 'error');
          });
      },
      editReply() {
        const replyDTO = {
            id: this.selectedReply.id,
            replies: this.editContent,
            adminId: this.selectedReply.adminId,
            commentId: this.selectedReply.commentId
        };
        axiosapi.put(`/backstage/replies/update/${this.selectedReply.id}`, replyDTO)
            .then(response => {
              Object.assign(this.selectedReply, response.data)
              const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'))
              modal.hide()
            })
            .catch(error => {
              console.error("There was an error editing the reply!", error)
            })
        },
        selectReply(reply, comment) {
      console.log("Selected reply:", reply);
      console.log("Selected comment:", comment);
      this.selectedReply = reply;
      this.selectedComment = comment;
    },
    deleteReply() {
        if (!this.selectedReply || !this.selectedComment) {
          console.error("selectedReply or selectedComment is null or undefined");
          return;
        }
    
        axiosapi.delete(`/backstage/replies/delete/${this.selectedReply.id}`)
          .then(response => {
            if (this.selectedComment.hasOwnProperty('reply')) {
              this.selectedComment.reply = null;
            } else {
              console.error("selectedComment does not have a reply property");
            }
    
           
            Swal.fire({
                icon: 'success',
                title: '刪除成功',
                text: '回覆已被刪除。',
              })
            })
    
          .catch(error => {
            console.error("There was an error deleting the reply!", error);
          });
    },
        deleteComment(commentId) {
          Swal.fire({
            title: '確認刪除',
            text: '您確定要刪除這條評論嗎？',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '刪除',
            cancelButtonText: '取消'
          }).then((result) => {
            if (result.isConfirmed) {
              axiosapi.delete(`/backstage/comments/deleteCommentReply/${commentId}`)
                .then(() => {
                  // 刪除成功，更新評論列表
                  this.comments = this.comments.filter(comment => comment.id !== commentId)
                  Swal.fire(
                    '刪除成功',
                    '評論已被刪除。',
                    'success'
                  )
                  this.fetchComments();
                })
                .catch(error => {
                  console.error("There was an error deleting the comment!", error)
                  Swal.fire(
                    '刪除失敗',
                    '無法刪除評論，請稍後再試。',
                    'error'
                  )
                })
            }
          })
        }
      },
    mounted() {
      this.fetchComments();
    }
  }
  </script>
  
  <style scoped>
  .product-image {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
    margin-right: 10px;
  }
  
  .reply-container {
    margin-top: 10px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
  }
  
  .reply-content {
    padding: 10px;
    background-color: #f8f9fa;
  }
  </style>
  