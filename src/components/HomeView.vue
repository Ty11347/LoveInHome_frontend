<template>
  <div>
    <div class="home" v-if="page !== 99 && page !== 100">
      <div class="home-title">LovInHome Management System</div>
      <div class="home-main-body">
        <div class="home-user-list-body">
          <el-button @click="sideMenuBarOpen = true" style="position: fixed; left: 2vw; top: 3vh; font-size: 1vw">
            MENU
          </el-button>

          <el-drawer
              title="MENU"
              :visible.sync="sideMenuBarOpen"
              :direction="direction"
              ref="menuDrawer">
          <span v-for="item in menuItemList" :key="item.name">
            <div v-if="page !== item.page" class="menu-bar-text" @click="menuOpenItem(item.page)">{{ item.name }}</div>
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
import {mapGetters, mapMutations} from "vuex";
import UserManagement from "@/components/userManagement";
import HouseManagement from "@/components/houseManagement";
import ParameterManagement from "@/components/parameterManagement";
import DeviceManagement from "@/components/deviceManagement";
import LoginPage from "@/components/loginPage";
import RegPage from "@/components/regPage";

export default {
  name: 'HelloWorld',
  components: {
    RegPage,
    LoginPage,
    DeviceManagement,
    ParameterManagement,
    HouseManagement,
    UserManagement
  },
  props: {
  },
  data() {
    return {
      sideMenuBarOpen: false, // controls side bar open or not
      direction: 'ltr', // side bar open direction (short for 'left to right')
      menuItemList: [
        {
          name: "User Management",
          page: 3
        },
        // {
        //   name: "House Management",
        //   page: 1
        // },
        {
          name: "Parameter Management",
          page: 2
        },
        {
          name: "Device Management",
          page: 0
        },
        // {
        //   name: "House Parameter Management",
        //   page: 4
        // },
        {
          name: "Log Out",
          page: 99
        }
      ], // menu bar item list and according page numbers
    }
  },
  computed: {
    ...mapGetters("system", ["page", "loading"])
  },

  methods: {
    ...mapMutations("system/", ["set_page"]),
    // click slide bar item to open other pages
    menuOpenItem(page) {
      if (page === 99){
        sessionStorage.setItem("username", undefined);
        sessionStorage.setItem("page", undefined);
      }
      this.set_page(page);
      this.$refs.menuDrawer.closeDrawer(); // close side bar after click other pages
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home{
  background-color: #bcd6d2;;
  height: 100%;
}
.home-title {
  font-weight: 400;
  font-size: 2vw;
  text-align: center;
  margin: 20px;
}

.home-main-body{
  /*height: 100vh;*/
  min-height: 100vh;
}

.home-user-list-body{
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
</style>
