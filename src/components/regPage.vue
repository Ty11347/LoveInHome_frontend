<template>
  <div class="reg-main-wrapper">
    <div class="reg-container">
      <div class="reg">
        <h2>Register New Account</h2>
        <form @submit.prevent="register">
          <div class="form-group">
            <label for="username">Username</label>
            <el-input id="username" v-model="username" placeholder="" clearable></el-input>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <el-input id="password" v-model="password" placeholder="" show-password clearable></el-input>
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <el-input id="confirm-password" v-model="confirmPassword" placeholder="" show-password clearable></el-input>
          </div>
          <button type="submit" style="margin-top: 4vh" id="login-btn">Register</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import acc from "../accounts/account";
import {mapMutations} from "vuex";
import api from "../request/api"

export default {
  name: "loginPage",
  data() {
    //这里存放数据
    return {
      username: '',
      password: '',
      confirmPassword: '',
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
    register() {
      this.validateInput(this.username);
      this.validateInput(this.password);
      if (this.username === '' || this.password === '' || this.confirmPassword === '') {
        this.regFail(1);
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.regFail(3);
        return;
      }

      api.fmRegister({
        username: this.username,
        password: this.password
      }).then(res => {
        if (res.status === 200){
          this.$message({
            message: 'Register Success!',
            type: 'success'
          });
          setTimeout(() => {
            this.set_page(99);
          }, 3000);
        } else if (res.status === 400){
          this.regFail(2);
        } else {
          this.regFail(99);
        }
      })

      // if (acc.find(item => item.username === this.username) !== undefined) {
      //   this.regFail(2);
      // } else {
      //   acc.push(
      //       {
      //         username: this.username,
      //         password: this.password
      //       }
      //   )
      //   this.$message({
      //     message: 'Register Success!',
      //     type: 'success'
      //   });
      //   setTimeout(() => {
      //     this.set_page(99);
      //   }, 3000);
      // }
    },
    regFail(code) {
      var loginBtn = document.getElementById("login-btn");
      loginBtn.style.transition = "all 0.2s";
      if (code === 0) {
        // unreached statement
        loginBtn.innerText = "Invalid Username/Password";
      } else if (code === 1) {
        loginBtn.innerText = "Empty Username/Password";
      } else if (code === 2) {
        loginBtn.innerText = "User Exists";
      } else if (code === 3) {
        loginBtn.innerText = "Passwords Are Not Identical";
      } else if (code === 99) {
        loginBtn.innerText = "Error";
      }
      loginBtn.style.backgroundColor = "#ff5555";
      this.password = "";
      this.username = "";
      this.confirmPassword = "";
      setTimeout(() => {
        loginBtn.style.transition = "all 0.5s";
        loginBtn.innerText = "Login";
        loginBtn.style.backgroundColor = "#4caf50";
      }, 1500);
    },

    toLogin() {
      this.set_page(99);
    }
  },
}
</script>

<style scoped>
.reg-main-wrapper {
  background-color: #bcd6d2;
}

.reg-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.reg {
  width: 30%;
  max-width: 40vw;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #ffffff88;
  box-shadow: 0 0 6px 3px rgba(0, 0, 0, 0.1);
}

.reg-window {
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
