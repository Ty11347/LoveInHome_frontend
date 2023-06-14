<template>
  <div class="login-main-wrapper">
    <div class="login-container">
      <div class="login">
        <h2>Management System Login</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username" class="label-text">Username</label>
            <el-input id="username" v-model="username" placeholder="" clearable class="username-input"></el-input>
          </div>
          <div class="form-group">
            <label for="password" class="label-text">Password</label>
            <el-input id="password" v-model="password" placeholder="" show-password clearable class="password-input"></el-input>
          </div>
          <div class="form-group">
            <span class="new-reg-text" @click="toReg">
              Register New Account
            </span>
          </div>
          <button type="submit" style="margin-top: 4vh" id="login-btn">Login</button>
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
      // handle input
      this.validateInput(this.username);
      this.validateInput(this.password);
      if (this.username === '' || this.password === '') {
        this.loginFail(1);
        return;
      }

      // login fail handle with api
      api.fmAPI.fmLogin(
          this.username,
          this.password
      ).then(res => {
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
        loginBtn.style.backgroundColor = "#5BE2C880";
      }, 1500);
    },

    toReg() {
      this.set_page(100);
    }
  },
}
</script>

<style scoped>
@import "../assets/font/font.css";

.login-main-wrapper {
  /*background-color: #bcd6d2;*/
  background-image: url("../../public/bg/bg1.jpg");
  /*background-color: transparent;*/
}


.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: transparent;
  backdrop-filter: blur(50px);
}

.login {
  width: 40%;
  max-width: 45vw;
  padding: 20px;
  /*border: 1px solid #ccc;*/
  /*border-radius: 5px;*/
  /*background-color: #ffffff88;*/
  /*box-shadow: 0 0 6px 3px rgba(0, 0, 0, 0.1);*/
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
  color: #DDD;
  margin: 0 0 20px 0;
  font-family: "CentralW01-Light";
}

.label-text{
  font-family: "CentralW01-Light";
  color: #DDD;
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
  background-color: #5BE2C880;
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
  font-size: 0.8vh;
  text-decoration: underline;
  cursor: pointer;
  font-family: "CentralW01-Light";
  font-style: italic;
  color: #c0c0c0;
}

.new-reg-text:hover {
  transition: color 300ms ease;
  color: #EEE;
}

#login-btn{
  background-color: #5BE2C845;
  font-family: CentralW01-Light;
  font-size: 3vh;
}

#login-btn:hover{
  background-color: #5BE2C880;
  transition: background-color 300ms ease;
  font-family: CentralW01-Light;
  font-size: 3vh;
}

</style>

<style>
.username-input .el-input__inner,
.password-input .el-input__inner {
  background-color: transparent !important;
  border-radius: 0 !important;
  border-width: 0 0 2px 0 !important;
  border-color: #C0C4CC !important;
  color: #DDD !important;
}

.username-input .el-input__inner:hover,
.password-input .el-input__inner:hover {
  border-color: #EEE !important;
}

/*.el-input__inner {*/
/*  background-color: transparent !important;*/
/*  border-radius: 0 !important;*/
/*  border-width: 0 0 2px 0 !important;*/
/*  border-color: #C0C4CC !important;*/
/*  color: #DDD !important;*/
/*}*/

/*.el-input__inner:hover{*/
/*  border-color: #EEE !important;*/
/*}*/
</style>
