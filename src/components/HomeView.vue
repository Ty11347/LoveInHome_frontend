<template>
  <div>
    <div class="home" v-if="page !== 99 && page !== 100">
      <div class="home-title">InHouse Management System</div>
      <div class="home-main-body">
        <div class="home-user-list-body">
          <el-button @click="sideMenuBarOpen = true" style="position: fixed; left: 2vw; top: 3vh; font-size: 1vw">
            MENU
          </el-button>

          <el-drawer title="MENU" :visible.sync="sideMenuBarOpen" :direction="direction" ref="menuDrawer">
            <span v-for="item in menuItemList" :key="item.name">
              <div v-if="page !== item.page" class="menu-bar-text" @click="menuOpenItem(item.page)">
                <i class="fas" :class="item.iconClass" style="margin-right: 0.5em;"></i> {{ item.name }}
              </div>
            </span>
          </el-drawer>

          <device-management v-if="page === 0"></device-management>
          <house-management v-if="page === 1"></house-management>
          <parameter-management v-if="page === 2"></parameter-management>
          <user-management v-if="page === 3"></user-management>
        </div>
      </div>
    </div>
    <login-page v-if="page === 99"></login-page>
    <reg-page v-if="page === 100"></reg-page>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import UserManagement from "@/components/userManagement";
import HouseManagement from "@/components/houseManagement";
import ParameterManagement from "@/components/parameterManagement";
import DeviceManagement from "@/components/deviceManagement";
import LoginPage from "@/components/loginPage";
import RegPage from "@/components/regPage";

export default {
  name: "HelloWorld",
  components: {
    RegPage,
    LoginPage,
    DeviceManagement,
    ParameterManagement,
    HouseManagement,
    UserManagement,
  },
  props: {},
  data() {
    return {
      sideMenuBarOpen: false,
      direction: "ltr",
      menuItemList: [
        { name: "Device Management", page: 0, iconClass: "fas fa-cogs" },
        { name: "House Management", page: 1, iconClass: "fas fa-home" },
        { name: "Parameter Management", page: 2, iconClass: "fas fa-sliders-h" },
        { name: "User Management", page: 3, iconClass: "fas fa-users" },
        { name: "Log Out", page: 99, iconClass: "fas fa-sign-out-alt" },
      ],
    };
  },
  computed: {
    ...mapGetters("system", ["page", "loading"]),
  },
  methods: {
    ...mapMutations("system/", ["set_page"]),
    menuOpenItem(page) {
      this.set_page(page);
      this.$refs.menuDrawer.closeDrawer();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  background-color: transparent;
  height: 100%;
}

.home-title {
  font-weight: 400;
  font-size: 2vw;
  text-align: center;
  margin: 20px;
  color: #000;
}

.home-main-body {
  /*height: 100vh;*/
  min-height: 100vh;
}

.home-user-list-body {
  /*height: 100%;*/
}

.menu-bar-text {
  padding: 1vh 1vw;
  font-size: 1.5vw;
  /*background-color: azure;*/
}

.menu-bar-text:hover {
  background-color: #ddd;
  transition: background-color 0.45s ease-out;
  cursor: pointer;
}

div {
  font-family: Poppins, serif;
}
</style>
