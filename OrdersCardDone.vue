<template>
  <div class="card-container">
    <div class="activity-row">
      <div class="activity-info">
        <h5 class="activity-name">
          <font-awesome-icon :icon="['far', 'circle-check']" />&nbsp;
          <strong>訂單編號: &nbsp;{{ order.orderid }}</strong>
        </h5>
      </div>
      <div class="activity-details">
        <div><strong>產品: 
          <ul>
            <li v-for="detail in order.details" :key="detail.orderid" style="color: brown;">
              {{ detail.name }} <br>尺寸: {{detail.size}} <br>數量: {{detail.quantity}} <br>顏色: {{detail.color}}            
            </li>
          </ul>
           </strong></div>
           <div style="color: brown; text-decoration: underline;"><strong>出貨時間:</strong></div>
           <div style="color: blue;">{{ order.shipping_at }}</div>

           <table class="order-details-table">
          <tr>
            <td><strong>狀態:</strong></td>
            <td><strong><span style="color: green;">{{ order.status }}</span></strong></td>
          </tr>
          <tr>
            <td><strong>收件人姓名:</strong></td>
            <td>{{ order.shipname }}</td>
          </tr>
          <tr>
            <td><strong>支付方式:</strong></td>
            <td>{{ order.payment }}</td>
          </tr>
          <tr>
            <td><strong>收件人地址:</strong></td>
            <td>{{ order.shipaddress }}</td>
          </tr>
          <tr>
            <td><strong>收件人電話:</strong></td>
            <td>{{ order.shipphone }}</td>
          </tr>
          <tr>
            <td><strong>配送方式:</strong></td>
            <td>{{ order.shipment }}</td>
          </tr>
          <tr>
            <td><strong>會員編號:</strong></td>
            <td>{{ order.userid }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

        

<script setup>
const props = defineProps(["order"]);
</script>

<style scoped>
.card-container {
  /* border: 2px solid green; */
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #f3fdf3;
  box-shadow: 2px 4px 8px rgba(0, 128, 0, 1);
}

.activity-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-info {
  margin-bottom: 10px;
}

.activity-name {
  display: flex;
  align-items: center;
}

.activity-details div {
  margin-bottom: 5px;
}

.order-details-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.order-details-table td {
  padding: 5px;
  border: 1px solid #ddd;
}

.btn {
  display: inline-block;
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
}

.btn:hover {
  background-color: #218838;
}
</style>
