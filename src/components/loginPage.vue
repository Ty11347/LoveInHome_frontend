<template>
  <div class="login-main-wrapper">
    <div class="login-container">
      <div class="login">
        <h2>LovIn Management System Login</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username">Username</label>
            <el-input id="username" v-model="username" placeholder="" clearable></el-input>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <el-input id="password" v-model="password" placeholder="" show-password clearable></el-input>
          </div>
          <div class="form-group">
            <span class="new-reg-text" @click="toReg">
              Register New Account
            </span>
          </div>
          <button type="submit" style="margin-top: 4vh" id="login-btn">Log in</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

// import acc from "../accounts/account";
import {mapMutations} from "vuex";
import api from "../request/api"

export default {
  name: "regPage",
  data() {
    //这里存放数据
    return {
      username: '',
      password: '',
      account: [
        {
          username: "tianyi",
          password: "123",
        },
        {
          username: "xiang",
          password: "123",
        }
      ]
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    ...mapMutations("system/", ["set_page"]),
    validateInput(input) {
      return JSON.stringify(input).trim();
    },
    login() {

      this.validateInput(this.username);
      this.validateInput(this.password);
      if (this.username === '' || this.password === '') {
        this.loginFail(1);
        return;
      }

      // login fail handle with api
      api.fmLogin({
        username: this.username,
        password: this.password
      }).then(res => {
        if (res.status === 200) {
          this.set_page(0);
        } else {
          this.loginFail(0);
        }
      });

      // login fail handle without backend api
      // if (acc.find(item => item.username === this.username && item.password === this.password) !== undefined) {
      //   this.set_page(0);
      // } else {
      //   this.loginFail(0);
      // }
    },
    loginFail(code) {
      // change login page appearance login status
      var loginBtn = document.getElementById("login-btn");
      loginBtn.style.transition = "all 0.2s";
      // when invalid login
      if (code === 0) {
        loginBtn.innerText = "Invalid Username/Password";
      }
      // when input is empty
      else if (code === 1) {
        loginBtn.innerText = "Empty Username/Password";
      }
      loginBtn.style.backgroundColor = "#ff5555";
      this.password = "";
      this.username = "";
      setTimeout(() => {
        loginBtn.style.transition = "all 0.5s";
        loginBtn.innerText = "Login";
        loginBtn.style.backgroundColor = "#4caf50";
      }, 1500);
    },

    toReg() {
      this.set_page(100);
    }
  },
}
</script>

<style scoped>
.login-main-wrapper {
  background-color: #bcd6d2;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login {
  width: 30%;
  max-width: 40vw;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #ffffff88;
  box-shadow: 0 0 6px 3px rgba(0, 0, 0, 0.1);
}

.login-window {
  margin: 25vh auto;
  width: 50vw;
  height: 50vh;
  border-radius: 5mm;
  border: 1px solid black;
  vertical-align: middle;
}

h2 {
  text-align: center;
  font-weight: 600;
  color: #363636;
  margin: 0 0 20px 0;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.new-reg-text {
  font-size: 1vh;
  text-decoration: underline;
  cursor: pointer;
}

.new-reg-text:hover {
  color: black;
}
</style>
