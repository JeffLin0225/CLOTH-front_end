import Activity from "@/views/activityPage/Activity.vue";
import Coupon from "@/views/activityPage/Coupon.vue";
import Admin from "@/views/activityPage/Admin.vue";
import Orders from "@/views/activityPage/Orders.vue";
import Customerservice from "@/views/activityPage/Customerservice.vue";
import Comment from "@/views/activityPage/Comment.vue";
import USER from "@/views/activityPage/USER.vue";

export default [
    { name: "pages-activity-link", path: "/activityPage/Activity", component: Activity },
    { name: "pages-coupon-link", path: "/activityPage/Coupon", component: Coupon },
    { name: "pages-admin-link", path: "/activityPage/Admin", component: Admin },
    { name: "pages-order-link", path: "/activityPage/Orders", component: Orders },
    { name: "pages-Customerservice-link", path: "/activityPage/Customerservice", component: Customerservice },
    { name: "pages-USER-link", path: "/activityPage/USER", component: USER },
    { name: "pages-Comment-link", path: "/activityPage/Comment", component: Comment },


]