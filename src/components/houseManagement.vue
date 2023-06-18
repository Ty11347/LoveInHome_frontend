<template>
  <div class="view-wrapper">
    <div class="device-title">
      Houses
      <el-button style="margin-left: auto" @click="addHouse">Add New House</el-button>
      <!--      <el-button style="margin-left: auto" @click="empty">Add New House</el-button>-->
    </div>
    <div style="text-align: center; font-size: 3vh" v-show="loading">Loading data...</div>
    <div class="device-item-wrapper" v-if="refresh">
      <div v-for="item in allHouseInfo" :key="item.id" class="device-item" @click="clickHouse(item)">
        <div>
          <div style="display: flex">
            <div class="device-serial-text">
              <div class="device-item-title-text">Address</div>
              <div class="device-item-text">{{ item.address }}</div>
            </div>
            <div class="device-type-text">
              <div class="device-item-title-text">State</div>
              <div class="device-item-text">{{ item.state }}</div>
            </div>
            <div class="device-type-text">
              <div class="device-item-title-text">Device Count</div>
              <div class="device-item-text">{{ item.devices.length }}</div>
            </div>
            <div class="device-type-text">
              <div class="device-item-title-text">User in House</div>
              <div class="device-item-text">{{ item.users.length }}</div>
            </div>
            <div class="device-type-text">
              <div class="device-item-title-text">Parameter Count</div>
              <div class="device-item-text">{{
                  Object.values(item.houseParameters).reduce((count, value) => {
                    if (value === true) {
                      count++;
                    }
                    return count;
                  }, 0)
                }}
              </div>
            </div>
            <div class="device-delete-btn">
              <i class="el-icon-close" @click.stop="deleteItem(item.id)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal v-model="houseModalStatus" draggable sticky width="700">
      <template #header>
        <p style="text-align:center">
          <span>House Info</span>
        </p>
      </template>
      <!--.....................................-->
      <div>
        <el-form label-position="right" label-width="120px" :model="tempModalData" ref="houseForm"
                 :rules="houseFormRules" class="house-form">
          <el-form-item label="Address" prop="address" id="form-item-addr">
            <el-input v-model="tempModalData.address"></el-input>
          </el-form-item>
          <el-form-item label="State" prop="state" id="form-item-state">
            <el-input v-model="tempModalData.state"></el-input>
          </el-form-item>
          <el-collapse class="house-collapse" v-model="activeNames" @change="empty" accordion
                       style="width: 520px; margin: 0 auto;color: #606266">
            <el-collapse-item title="User" name="user" style="color: #606266">
              <el-form label-position="right" label-width="180px" :model="adminObj" ref="houseUserForm"
                       :rules="houseFormRules" class="house-inner-form">
                <el-form-item label="Add Admin User" style="margin-top: 20px">
                  <el-select v-model="adminObj.id" placeholder="Please Select a User" no-data-text="No Data" style="width: 70%"
                  >
                    <div v-for="avaUser in availableUsers" :key="avaUser.id">
                      <el-option :label="avaUser.username" :value="avaUser.id"></el-option>
                    </div>
                  </el-select>
                  <button class="add-btn" @click.prevent="addAdminUser2List(adminObj.id)">Add</button>
                </el-form-item>
                <el-form-item label="Add House User" style="margin-top: 20px">
                  <el-select v-model="userObj.id" placeholder="Please Select a User" no-data-text="No Data" style="width: 70%"
                  >
                    <div v-for="avaUser in availableUsers" :key="avaUser.id">
                      <el-option :label="avaUser.username" :value="avaUser.id"></el-option>
                    </div>
                  </el-select>
                  <button class="add-btn" @click.prevent="addUser2List(userObj.id)">Add</button>
                </el-form-item>
              </el-form>
              <div style="max-height: 130px; overflow: auto">
                <div v-for="user in addedUsers" :key="user.id">
                  <el-row style="margin: 12px 0">
                    <el-col :span="19">
                      <div>
                        <div>Username</div>
                        <span v-show="user.isAdmin" style="color: indianred">{{ user.username }} (House Admin)</span>
                        <span v-show="!user.isAdmin">{{ user.username }}</span>
                      </div>
                    </el-col>
                    <el-col :span="5">
                      <div class="modal-delete-btn">
                        <i class="el-icon-close" @click="deleteItemInList(user.id)"></i>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="Device" name="device">
              <el-form label-position="right" label-width="180px" :model="deviceObj" ref="houseUserForm"
                       :rules="houseFormRules" class="house-inner-form">
                <el-form-item label="Add Available Device" style="margin-top: 20px">
                  <el-select v-model="deviceObj.id" placeholder="Please Select a Device" no-data-text="No Data"
                             style="width: 70%"
                  >
                    <div v-for="avaDevice in availableDevices" :key="avaDevice.id">
                      <el-option :label="avaDevice.serialNum" :value="avaDevice.id"></el-option>
                    </div>
                  </el-select>
                  <button class="add-btn" @click.prevent="addDevice2List(deviceObj.id)">Add</button>
                </el-form-item>
              </el-form>
              <div style="max-height: 130px; overflow: auto">
                <div v-for="device in addedDevices" :key="device.id">
                  <el-row style="margin: 12px 0">
                    <el-col :span="14">
                      <div>
                        <div>Serial No.</div>
                        {{ device.serialNum }}
                      </div>
                    </el-col>
                    <el-col :span="5">
                      <div>
                        <span>Device Status</span>
                        <el-switch v-model="device.state"></el-switch>
                      </div>
                    </el-col>
                    <el-col :span="5">
                      <div class="modal-delete-btn">
                        <i class="el-icon-close" @click="deleteItemInDevice(device.id)"></i>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <!--.....................................-->
            </el-collapse-item>
          </el-collapse>

          <div style="width: 80%; margin: 0 auto">
            <el-row>
              <el-col :span="24">
                <div style="margin: 16px 0 10px 0">Parameters</div>
              </el-col>
              <el-col :span="8" v-for="(para, index) in parameters" :key="para">
                <el-form-item :label="para" style="margin-bottom: 0">
                  <el-switch v-model="parametersValue[index]"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--.....................................-->
          <div style="margin: 10px 40px">
            <div v-if="tempModalData.createdDate !== undefined">
              <span>Create Date: </span>
              <span>{{ tempModalData.createdDate }}</span>
            </div>
            <div v-if="tempModalData.lastModifiedDate !== undefined">
              <span>Last Modified Date: </span>
              <span>{{ tempModalData.lastModifiedDate }}</span>
            </div>
            <div v-if="tempModalData.houseParameters !== undefined">
            </div>
            <div v-if="tempModalData.id !== undefined">
              <span>Device ID </span>
              <span style="font-family: Courier New,monospace; font-weight: 600">{{ tempModalData.id }}</span>
            </div>
          </div>
        </el-form>
      </div>
      <!--.....................................-->
      <template #footer>
        <Button size="large" @click="closeModal" id="cancel-btn">Cancel</Button>
        <Button size="large" @click="confirmModal(addOrUpdate)" id="confirm-btn">Confirm</Button>
        <!--        <Button size="large" @click="empty" id="confirm-btn">Confirm</Button>-->
      </template>
    </Modal>

  </div>
</template>

<script>
import api from "../request/api"

export default {
  name: "houseManagement",
  data() {
    return {
      loading: true,
      allHouseInfo: [],
      houseModalStatus: false,
      houseSelected: {},
      tempModalData: {},
      addOrUpdate: 0, // 0 for add 1 for update
      refresh: true,
      houseFormRules: { // unfinished @ 1:50 June 15
        address: [
          {required: true, message: 'Please input address', trigger: 'blur'},
        ],
        state: [
          {required: true, message: 'Please input state', trigger: 'blur'},
        ],
      },
      activeNames: '',
      availableUsers: [],
      availableDevices: [],
      adminObj: {},
      userObj: {},
      userArr: [],
      deviceObj: {},
      addedDevices: [],
      addedUsers: [],
      parameters: [],
      parametersValue: [],
      auBackup: [],
      adBackup: []
    }
  },
  watch: {},
  methods: {
    empty() {

    },

    combineAdminAndUser() {
      this.addedUsers = [];
      this.addedUsers.unshift(this.dcp(this.adminObj));
      this.addedUsers.push(...this.userArr);
    },

    deleteItemInDevice(id) {
      this.addedDevices.map((item, index) => {
        if (item.id === id) {
          this.addedDevices.splice(index, 1);
        }
      });
      this.availableDevices = this.dcp(this.adBackup)
      this.availableDevices = this.availableDevices.filter((item) => !this.addedDevices.some((ele) => ele.id === item.id));
    },

    deleteItemInList(id) {
      this.addedUsers.map((item, index) => {
        if (item.id === id) {
          this.addedUsers.splice(index, 1);
        }
      });
      this.availableUsers = this.dcp(this.auBackup)
      this.availableUsers = this.availableUsers.filter((item) => !this.addedUsers.some((ele) => ele.id === item.id));
    },

    async addAdminUser2List(id) {
      this.adminObj = {};
      this.adminObj.id = id;
      this.adminObj.isAdmin = true;
      var res = await api.userAPI.getUserByID(id);
      if (res.status === 200) {
        this.adminObj.username = res.data.username;
      } else {
        this.$message({
          message: 'Error: Fetch User by ID failed',
          type: 'warning'
        });
        this.adminObj.username = "N/A";
      }
      this.addedUsers.push(this.dcp(this.adminObj));
      this.adminObj = {};
      this.availableUsers = this.dcp(this.auBackup)
      this.availableUsers = this.availableUsers.filter((item) => !this.addedUsers.some((ele) => ele.id === item.id));
    },

    async addUser2List(id) {
      this.userObj = {};
      var res = await api.userAPI.getUserByID(id);
      this.userObj.id = id;
      this.userObj.isAdmin = false;
      if (res.status === 200) {
        this.userObj.username = res.data.username;
      } else {
        this.$message({
          message: 'Error: Fetch User by ID failed',
          type: 'warning'
        });
        this.userObj.username = "N/A";
      }
      this.addedUsers.push(this.dcp(this.userObj));
      this.userObj = {};
      this.availableUsers = this.dcp(this.auBackup)
      this.availableUsers = this.availableUsers.filter((item) => !this.addedUsers.some((ele) => ele.id === item.id));
    },

    async addDevice2List(id) {
      this.deviceObj = {};
      this.deviceObj.id = id;
      this.deviceObj.state = true;
      this.deviceObj.isInstalled = true;
      var res = await api.deviceAPI.getAllDeviceById(id);
      if (res.status === 200) {
        this.deviceObj.serialNum = res.data.serialNum;
      } else {
        this.$message({
          message: 'Error: Fetch Device by ID failed',
          type: 'warning'
        });
        this.deviceObj.serialNum = "N/A";
      }
      this.addedDevices.push(this.dcp(this.deviceObj));
      this.deviceObj = {};
      this.availableDevices = this.dcp(this.adBackup)
      this.availableDevices = this.availableDevices.filter((item) => !this.addedDevices.some((ele) => ele.id === item.id));
    },

    refreshList() {
      this.refresh = !this.refresh;
      this.refresh = !this.refresh;
      this.initStateData();
    },
    formatApi(data) {
      return JSON.parse(JSON.stringify(data))
    },
    // format all device data and store to local variable: this.allDeviceInfo
    initStateData() {
      // with api
      api.houseAPI.getAllHouse().then(res => {
        res = this.formatApi(res);
        if (res.status === 200) {
          this.loading = false;
          this.allHouseInfo = res.data;
        } else {
          this.$message({
            message: 'Error: Fetch Data fail',
            type: 'warning'
          });
        }
      })
    },

    deleteItem(id) {
      this.$confirm('Confirm to Delete this house?', 'Delete', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.allHouseInfo = this.allHouseInfo.filter(item => item.id !== id);
        // with api
        api.houseAPI.deleteHouse(id).then(res => {
          // if status code is 200, format all device data and store to local variable: this.allDeviceInfo
          if (res.status === 200) {
            this.refreshList();
            this.$message({
              type: 'success',
              message: 'Delete Success'
            });
          } // if status is not 200, show an error message test test
          else {
            this.refreshList();
            this.$message({
              type: 'warning',
              message: 'Error: Delete Failed'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel Delete'
        });
      });
    },

    async clickHouse(device) {
      this.houseModalStatus = true;
      this.addOrUpdate = 1;
      this.houseSelected = device;
      console.log(device);
      this.tempModalData = this.dcp(this.houseSelected);
      this.addedDevices = this.dcp(this.tempModalData.devices);
      this.addedUsers = this.dcp(this.tempModalData.users);
      await this.getAvailableUsersAndDevices();
      this.parameters = Object.keys(this.dcp(this.tempModalData.houseParameters));
      this.parametersValue = Object.values(this.dcp(this.tempModalData.houseParameters));
    },

    async addHouse() {
      this.houseModalStatus = true;
      this.addOrUpdate = 0;
      this.tempModalData = {
        address: "",
        state: "",
      };
      this.addedDevices = [];
      this.addedUsers = [];
      await this.getAvailableUsersAndDevices();
    },

    closeModal() {
      this.refreshList();
      this.houseModalStatus = false;
    },

    confirmModal(code) { // unfinished
      // with api
      this.$refs.houseForm.validate((valid) => {
        if (valid) {
          if (code === 0) { // add new
            const isAdminCount = this.addedUsers.filter(user => user.isAdmin).length;

            if (isAdminCount === 0) {
              this.$message({
                type: 'warning',
                message: 'At least one admin user is required'
              });
            } else if (isAdminCount > 1) {
              this.$message({
                type: 'warning',
                message: 'Only one admin user is required'
              });
            } else {
              var hp = {};
              for (let i = 0; i < this.parameters.length; i++) {
                hp[this.parameters[i]] = this.parametersValue[i];
              }

              const tempAD = this.dcp(this.addedDevices);
              for (let i = 0; i < this.addedDevices.length; i++) {
                tempAD[i].state = this.addedDevices[i].state ? "ON" : "OFF";
              }

              const temp = {
                address: this.tempModalData.address,
                state: this.tempModalData.state,
                users: this.addedUsers,
                devices: tempAD,
                houseParameters: hp
              };

              this.allHouseInfo.push(temp);

              api.houseAPI.addHouse(temp).then(res => {
                if (res.status === 201) {
                  this.refreshList();
                  this.$message({
                    type: 'success',
                    message: 'Add New House Success'
                  });
                  this.closeModal();
                } else {
                  this.refreshList();
                  this.$message({
                    type: 'warning',
                    message: 'Add New House Failed'
                  });
                }
              });
            }

          } else if (code === 1) { // update
            const index = this.allHouseInfo.findIndex(item => item.id === this.tempModalData.id);
            if (index !== -1) {
              this.allHouseInfo[index] = this.tempModalData;
            }

            const hp = this.parameters.reduce((obj, parameter, i) => {
              obj[parameter] = this.parametersValue[i];
              return obj;
            }, {});

            this.addedDevices = this.addedDevices.map(({
                                                         createdDate,
                                                         lastModifiedDate,
                                                         type,
                                                         serialNum,
                                                         ...rest
                                                       }) => rest);

            this.addedUsers = this.addedUsers.map(({
                                                     createdDate,
                                                     lastModifiedDate,
                                                     password,
                                                     email,
                                                     username,
                                                     ...rest
                                                   }) => rest);

            const tempAD = this.addedDevices.map(device => ({
              ...device,
              state: device.state ? "ON" : "OFF"
            }));

            const temp = {
              address: this.tempModalData.address,
              state: this.tempModalData.state,
              devices: tempAD,
              users: this.addedUsers,
              houseParameters: hp,
            };

            const isAdminUserCount = temp.users.reduce((count, user) => (user.isAdmin ? count + 1 : count), 0);

            if (isAdminUserCount === 0) {
              this.$message({
                type: 'warning',
                message: 'At least one admin is required.'
              });
            } else if (isAdminUserCount > 1) {
              this.$message({
                type: 'warning',
                message: 'Only one admin is allowed.'
              });
            } else if (temp.devices.length === 0) {
              this.$message({
                type: 'warning',
                message: 'At least one device is required.'
              });
            } else {
              api.houseAPI.updateHouse(this.tempModalData.id, temp).then(res => {
                this.refreshList();
                if (res.status === 200) {
                  this.$message({
                    type: 'success',
                    message: 'Update House Success'
                  });
                } else {
                  this.$message({
                    type: 'warning',
                    message: 'Update House Failed'
                  });
                }
                this.closeModal();
              });
            }
          }
        } else {
          this.$message({
            message: 'Error: Please refill the form',
            type: 'warning'
          });
          return false;
        }
      });
    },

    async getAvailableUsersAndDevices() {
      var res1 = await api.deviceAPI.getAvaDevice();
      if (res1.status === 200) {
        this.availableDevices = res1.data;
        this.adBackup = res1.data;
      } else {
        this.$message({
          message: 'Fetch Device List Failed, Status:' + res1.status,
          type: 'warning'
        });
      }
      var res2 = await api.userAPI.getAvaUser();
      if (res2.status === 200) {
        this.availableUsers = res2.data;
        this.auBackup = res2.data;
      } else {
        this.$message({
          message: 'Fetch User List Failed, Status:' + res2.status,
          type: 'warning'
        });
      }
      var res3 = await api.paraAPI.getAllParaName();
      if (res3.status === 200) {
        this.parameters = res3.data;
        console.log(res3.data);
        this.parametersValue = [];
        for (let i = 0; i < this.parameters.length; i++) {
          this.parametersValue.push(true);
        }
      } else {
        this.$message({
          message: 'Fetch Parameter List Failed, Status:' + res3.status,
          type: 'warning'
        });
      }
    },

    dcp(obj) {
      return JSON.parse(JSON.stringify(obj));
    }

  },
  created() {
    this.initStateData();
  }
}
</script>

<style scoped>

.collapse-title-text {
  color: #606266;
  font-size: 2vh;
  font-weight: 500;
  margin: 10px;
}

.view-wrapper {
  padding-bottom: 10vh;
  margin: 0;
  height: 100%;
  background-color: #bcd6d2;
  /*background-color: #bcd6d2;*/
}

.device-item-wrapper {
  width: 70vw;
  margin: 0 auto;
  text-align: center;
}

.device-item {
  background-color: #ffffff88;
  border-radius: 0.5vw;
  height: 12vh;
  margin: 3vh auto;
  box-shadow: 0 0 6px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  /*display: flex;*/
}

.device-item:hover {
  box-shadow: 0 0 9px 3px rgba(0, 0, 0, 0.2);
  transform: scale(1.01, 1.01);
  background-color: #ffffff99;
  backdrop-filter: blur(5px);
  transition: background-color 800ms, box-shadow 300ms, transform 800ms, backdrop-filter 100ms ease;
  cursor: pointer;
}

.device-serial-text {
  text-align: left;
  padding: 0 0 0 3vw;
  width: 13vw;
  height: 12vh;
}

.device-type-text {
  font-size: 2.5vh;
  width: 11vw;
  line-height: 6vh;
  text-align: left;
  padding: 0 0 0 3vw;
}

.device-item-text {
  line-height: 6vh;
  color: #363636;
  font-size: 2.5vh;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-item-title-text {
  line-height: 2vh;
  padding-top: 3.2vh;
  color: #959499;
  font-size: 1.8vh;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-state-text {
  margin: 0 1vw;
  display: inline;
  font-size: 2.5vh;
  color: #363636;
  vertical-align: middle;
}

.device-title {
  /*color: #AAABBB;*/
  display: flex;
  font-size: 3vh;
  margin: 2vw auto;
  width: 70vw;
}

.device-delete-btn {
  line-height: 12vh;
  font-size: 3vh;
  vertical-align: middle;
  width: 5vw;
  margin-left: auto;
}

.device-delete-btn:hover {
  color: black;
  font-size: 3.5vh;
  transition: color, font-size 0.2s linear;
  cursor: pointer;
}

.modal-delete-btn {
  margin-top: 8px;
  font-size: 2.5vh;
  vertical-align: middle;
  width: 3vw;
  margin-left: auto;
}

.modal-delete-btn:hover {
  color: black;
  font-size: 2.6vh;
  transition: color, font-size 0.2s linear;
  cursor: pointer;
}

#confirm-btn {
  background-color: #ff4f4f;
  color: #fff;
}

#confirm-btn:hover {
  border-color: transparent;
  color: #fff;
}

#cancel-btn {

}

#cancel-btn:hover {
  color: #747b8b;
  background-color: #fff;
  border-color: #e3e5e8;
}

.add-btn {
  padding: 0 1vw;
  margin: 0 1vw;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
}

.add-btn:hover {
  padding: 0 1vw;
  margin: 0 1vw;
  border: 1px solid #888;
  border-radius: 5px;
  background: #ddd;
  cursor: pointer;
}

div {
  font-family: Poppins, serif;
}

</style>

<style>
.ivu-modal-content {
  background-color: #ffffff70 !important;
  backdrop-filter: blur(12px) !important;
  border-radius: 12px !important;
}

.ivu-modal-mask {
  background-color: transparent !important;
}

.house-collapse .el-collapse-item__header {
  background-color: transparent;
  color: #606266;
}

.house-collapse .el-collapse-item__wrap {
  background-color: transparent;
  border-top: 1px solid #999;
  border-bottom: 1px solid #999;
}

.house-collapse .el-collapse-item__content {
  padding-bottom: 10px;
}

.house-collapse .el-collapse div {
  margin: 0 auto !important;
  width: 520px !important;
}

.el-form-item .coll-box {
  margin-bottom: 5px !important;
}

.house-form .el-form-item div {
  padding-right: 7% !important;
}

.house-inner-form .el-form-item div {
  padding-right: 0 !important;
}

</style>
