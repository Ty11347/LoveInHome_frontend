<template>
  <div class="home">
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
          <span>
            <div v-if="page !== 0" class="menu-bar-text" @click="openUM">User Management</div>
            <div v-if="page !== 1" class="menu-bar-text" @click="openHM">House Management</div>
            <div v-if="page !== 2" class="menu-bar-text" @click="openPM">Parameter Management</div>
          </span>
        </el-drawer>

        <user-management v-if="page === 0"></user-management>
        <house-management v-if="page === 1"></house-management>
        <parameter-management v-if="page === 2"></parameter-management>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import UserManagement from "@/components/userManagement";
import HouseManagement from "@/components/houseManagement";
import ParameterManagement from "@/components/parameterManagement";

export default {
  name: 'HelloWorld',
  components: {ParameterManagement, HouseManagement, UserManagement},
  props: {
    msg: String
  },
  data() {
    return {
      sideMenuBarOpen: false, // controls side bar open or not
      direction: 'ltr', // side bar open direction (short for 'left to right')
    }
  },
  computed:{
    ...mapGetters("system",["page", "loading"])
  },

  methods: {
    ...mapMutations("system/", ["set_page"]),
    // click slide bar to open user management page
    openUM(){
      this.set_page(0);
      console.log("open user management")
      this.$refs.menuDrawer.closeDrawer(); // close side bar after click other pages
    },
    // click slide bar to open house management page
    openHM(){
      this.set_page(1);
      console.log("open house management")
      this.$refs.menuDrawer.closeDrawer(); // close side bar after click other pages
    },
    // click slide bar to open parameter management page
    openPM(){
      this.set_page(2);
      console.log("open parameter management")
      this.$refs.menuDrawer.closeDrawer(); // close side bar after click other pages
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home-title{
  font-weight: 400;
  font-size: 2vw;
  text-align: center;
  margin: 20px;
}

.menu-bar-text{
  padding: 1vh 1vw;
  font-size: 1.5vw;
  /*background-color: azure;*/
}

.menu-bar-text:hover{
  background-color: #ddd;
  transition: background-color 0.45s ease-out;
  cursor: pointer;
}
</style>
