<template>
  <div class="view-wrapper">
    <div class="device-title">
      Houses
      <!--      <el-button style="margin-left: auto" @click="addDevice">Add New House</el-button>-->
      <el-button style="margin-left: auto" @click="empty">Add New House</el-button>
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
                  item.houseParameters.temperature === true ?
                      (item.houseParameters.light === true ?
                          (item.houseParameters.windy === true ? 3 : 2) : 1) : 0
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
              <div v-for="user in tempModalData.users" :key="user.id">
                <div class="collapse-title-text">Username: {{ user.username }}</div>
                <el-row>
                  <el-col :offset="2" :span="11">
                    <el-form-item label="Set As Admin" class="coll-box">
                      <el-switch v-model="user.isAdmin"></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="Set As Active" class="coll-box">
                      <el-switch v-model="user.isActive"></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
            <el-collapse-item title="Device" name="device">
              <div v-for="device in tempModalData.devices" :key="device.id">
                <div class="collapse-title-text">Serial Number: {{ device.serialNum }}</div>
                <el-row>
                  <el-col :offset="2" :span="11">
                    <el-form-item label="Set As Installed" class="coll-box">
                      <el-switch v-model="device.isInstalled"></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="Set Status" class="coll-box">
                      <el-switch v-model="device.state"></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>

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
              <span>House Parameters:  </span>
              <span>{{
                  JSON.stringify(tempModalData.houseParameters)
                      .replace(/[{"}]/g, " ")
                      .replace(/ :/g, ": ")
                }}</span>
            </div>
            <div v-if="tempModalData.id !== undefined">
              <span>Device ID </span>
              <span style="font-family: Courier New,monospace; font-weight: 600">{{ tempModalData.id }}</span>
            </div>
          </div>
        </el-form>
      </div>
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
        name: [
          {required: true, message: 'Please input parameter name', trigger: 'blur'},
        ],
        unit: [
          {required: true, message: 'Please input parameter unit', trigger: 'blur'},
        ],
      },
      activeNames: ''
    }
  },
  watch: {},
  methods: {
    empty() {

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
              message: 'Error: Delete Fail'
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

    clickHouse(device) {
      this.houseSelected = device;
      this.tempModalData = JSON.parse(JSON.stringify(this.houseSelected));
      this.houseModalStatus = true;
      this.addOrUpdate = 1;
    },

    addDevice() { // unfinished
      this.houseModalStatus = true;
      this.addOrUpdate = 0;
      this.tempModalData = {};
      this.tempModalData = {
        address: "",
        state: "",
      };
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
            this.allHouseInfo.push(this.tempModalData);
            api.houseAPI.addHouse({
              address: this.tempModalData.address,
              state: this.tempModalData.state
              // other attributes
            }).then(res => {
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
            })
          }
          else if (code === 1) { // update
            const index = this.allHouseInfo.findIndex(item => item.id === this.tempModalData.id);
            if (index !== -1) {
              this.allHouseInfo[index] = this.tempModalData;
            }
            var user = [];
            var device = [];
            for (var i = 0; i < this.tempModalData.users.length; i++) {
              user.push({
                id: this.tempModalData.users[i].id,
                isAdmin: this.tempModalData.users[i].isAdmin,
                isActive: this.tempModalData.users[i].isActive,
              })
            }
            for (var j = 0; j < this.tempModalData.devices.length; j++) {
              device.push({
                id: this.tempModalData.devices[j].id,
                state: this.tempModalData.devices[j].state ? "ON" : "OFF",
                // isInstalled: this.tempModalData.devices[j].isInstalled,
              })
            }
            api.houseAPI.updateHouse(this.tempModalData.id, {
              address: this.tempModalData.address,
              state: this.tempModalData.state,
              devices: device,
              users: user,
              houseParameters: this.tempModalData.houseParameters,
              // other attributes
            }).then(res => {
              if (res.status === 200) {
                this.refreshList();
                this.$message({
                  type: 'success',
                  message: 'Update House Success'
                });
                this.closeModal();
              } else {
                this.refreshList();
                this.$message({
                  type: 'warning',
                  message: 'Update House Failed'
                });
              }
            })
          }
          this.closeModal();
        } else {
          this.$message({
            message: 'Error: Please refill the form',
            type: 'warning'
          });
          return false;
        }
      });
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

</style>
