<template>
  <div class="view-wrapper">
    <div class="device-title">
      Devices
      <el-button style="margin-left: auto" @click="addDevice">Add Device</el-button>
    </div>
    <div style="text-align: center; font-size: 3vh" v-show="loading">Loading data...</div>
    <div class="device-item-wrapper" v-if="refresh">
      <div v-for="item in allDeviceInfo" :key="item.id" class="device-item" @click="clickDevice(item)">
        <!--          <el-col :span="16">-->
        <div>
          <div style="display: flex">
            <div class="device-serial-text">
              <div class="device-item-title-text">Serial Number:</div>
              <div class="device-item-text">{{ item.serialNum }}</div>
            </div>

            <div class="device-type-text">
              <div class="device-item-title-text">Type of Device:</div>
              <div class="device-item-text">{{ item.type }}</div>
            </div>

              <div style="line-height: 12vh; margin-left: auto">
                <div class="device-state-text">Current Status</div>
                <span @click.stop="">
                <el-switch
                    v-model="item.state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="switchChange(item)">
                </el-switch>
              </span>
              </div>

              <div class="device-delete-btn">
                <i class="el-icon-close" @click.stop="deleteItem(item.id, item.serialNum, item.type)"></i>
              </div>
          </div>
        </div>
      </div>
    </div>

    <Modal v-model="deviceModalStatus" draggable sticky width="360">
      <template #header>
        <p style="text-align:center">
          <span>Device Info</span>
        </p>
      </template>
      <div>
        <el-form label-position="right" label-width="120px" :model="tempModalData" ref="deviceForm" :rules="deviceFormRules">
          <el-form-item label="Serial Number" prop="serialNum">
            <el-input v-model="tempModalData.serialNum"></el-input>
          </el-form-item>
          <el-form-item label="Device Type" prop="type">
            <el-input v-model="tempModalData.type"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Current Status">
                <el-switch v-model="tempModalData.state"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Install Status">
                <el-switch v-model="tempModalData.isInstalled"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <div style="font-family: Courier New,monospace; font-size: 5px;">*Note: Device current status refers to blablablabla...</div>
          <div style="text-align: center; margin-top: 15px" v-if="tempModalData.id !== undefined">
            <span>Device ID </span>
            <span style="font-family: Courier New,monospace; font-weight: 600">{{ tempModalData.id }}</span>
          </div>
        </el-form>
      </div>
      <template #footer>
        <Button size="large" @click="closeModal" id="cancel-btn">Cancel</Button>
        <Button size="large" @click="confirmModal(addOrUpdate)" id="confirm-btn">Confirm</Button>
      </template>
    </Modal>

  </div>
</template>

<script>
import api from "../request/api"

export default {
  name: "deviceManagement",
  data() {
    return {
      loading: true,
      allDeviceInfo: [],
      deviceModalStatus: false,
      deviceSelected: {},
      tempModalData: {},
      addOrUpdate: 0, // 0 for add 1 for update
      refresh: true,
      deviceFormRules: {
        serialNum: [
          {required: true, message: 'Please input serial name', trigger: 'blur'},
        ],
        type: [
          {required: true, message: 'Please input device type', trigger: 'blur'},
        ],
      }
    }
  },
  watch: {},
  methods: {
    empty() {

    },
    switchChange(item) {
      api.deviceAPI.updateDevice(item.id, {
        serialNum: item.serialNum,
        type: item.type,
        state: item.state ? "ON" : "OFF",
        isInstalled: item.isInstalled
      }).then(res => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: 'Operation Success'
          });
          this.refreshList();
        } else {
          this.$message({
            type: 'warning',
            message: 'Operation Failed'
          });
          this.refreshList();
        }
      })
    },
    formatApi(data) {
      return JSON.parse(JSON.stringify(data))
    },
    // format all device data and store to local variable: this.allDeviceInfo
    initStateData() {
      // with api
      api.deviceAPI.getAllDevice().then(res => {
        res = this.formatApi(res);
        if (res.status === 200) {
          this.loading = false;
          this.allDeviceInfo = res.data;
          this.allDeviceInfo.forEach(device => {
            device.state = device.state === "ON";
          });
        } else {
          this.$message({
            message: 'Error: Fetch Data fail',
            type: 'warning'
          });
        }
      })
    },

    deleteItem(id, serial, type) {
      this.$confirm('Confirm to Delete this ' + type + ' Device?', 'Delete', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.allDeviceInfo = this.allDeviceInfo.filter(item => item.id !== id);
        // with api
        api.deviceAPI.deleteDevice(id).then(res => {
          // if status code is 200, format all device data and store to local variable: this.allDeviceInfo
          if (res.status === 200) {
            this.refreshList();
            this.$message({
              type: 'success',
              message: 'Delete Success'
            });
          } // if status is not 200, show an error message
          else {
            this.refreshList();
            this.$message({
              type: 'warning',
              message: 'Error: Delete Fail'
            });
          }
        })
      }).catch(() => {
        this.refreshList();
        this.$message({
          type: 'info',
          message: 'Cancel Delete'
        });
      });
    },

    clickDevice(device) {
      this.deviceSelected = device;
      this.tempModalData = JSON.parse(JSON.stringify(this.deviceSelected));
      this.deviceModalStatus = true;
      this.addOrUpdate = 1;
    },

    addDevice() {
      this.deviceModalStatus = true;
      this.addOrUpdate = 0;
      this.tempModalData = {};
      this.tempModalData = {
        serialNum: "",
        type: "",
        state: true,
        isInstalled: false
      };
    },

    closeModal() {
      this.refreshList();
      this.deviceModalStatus = false;
    },

    confirmModal(code) {
      this.$refs.deviceForm.validate((valid) => {
        if (valid) {
          if (code === 0) {
            this.allDeviceInfo.push(this.tempModalData);
            api.deviceAPI.addDevice({
              serialNum: this.tempModalData.serialNum,
              type: this.tempModalData.type,
              state: this.tempModalData.state ? "ON" : "OFF",
              isInstalled: this.tempModalData.isInstalled
            }).then(res => {
              console.log(res);
              if (res.status === 201) {
                this.$message({
                  type: 'success',
                  message: 'Add New Device Success'
                });
                this.closeModal();
                this.refreshList();
              } else {
                this.refreshList();
                this.$message({
                  type: 'warning',
                  message: 'Add New Device Failed'
                });
              }
            })
          }
          else if (code === 1) {
            const index = this.allDeviceInfo.findIndex(item => item.id === this.tempModalData.id);
            if (index !== -1) {
              this.allDeviceInfo[index] = this.tempModalData;
            }
            api.deviceAPI.updateDevice(this.tempModalData.id, {
              serialNum: this.tempModalData.serialNum,
              type: this.tempModalData.type,
              state: this.tempModalData.state ? "ON" : "OFF",
              isInstalled: this.tempModalData.isInstalled
            }).then(res => {
              if (res.status === 200) {
                this.$message({
                  type: 'success',
                  message: 'Update Success'
                });
                this.closeModal();
                this.refreshList();
              } else {
                this.refreshList();
                this.$message({
                  type: 'warning',
                  message: 'Update Failed'
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

    refreshList() {
      this.refresh = !this.refresh;
      this.refresh = !this.refresh;
      this.initStateData();
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
  width: 18vw;
  height: 12vh;
}

.device-type-text {
  font-size: 2.5vh;
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
}

.device-delete-btn:hover {
  color: black;
  font-size: 3.5vh;
  transition: color, font-size 0.2s linear;
  cursor: pointer;
}

#confirm-btn{
  background-color: #ff4f4f !important;
  color: #fff !important;
}

#confirm-btn:hover{
  border-color: transparent !important;
  color: #fff !important;
}

#cancel-btn {

}

#cancel-btn:hover {
  color: #747b8b;
  background-color: #fff;
  border-color: #e3e5e8;
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
</style>
