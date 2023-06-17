<template>
  <div class="view-wrapper">
    <div class="device-title">
      Parameters
      <el-button style="margin-left: auto" @click="addDevice">Add New Parameter</el-button>
    </div>
    <div style="text-align: center; font-size: 3vh" v-show="loading">Loading data...</div>
    <div class="device-item-wrapper" v-if="refresh">
      <div v-for="item in allParameterInfo" :key="item.id" class="device-item" @click="clickDevice(item)">
          <div>
            <div style="display: flex">
              <div class="device-serial-text">
                <div class="device-item-title-text">Parameter Name:</div>
                <div class="device-item-text">{{ item.name }}</div>
              </div>
              <div class="device-type-text">
                <div class="device-item-title-text">Parameter Unit:</div>
                <div class="device-item-text">{{ item.unit }}</div>
              </div>
              <div class="device-delete-btn">
                <i class="el-icon-close" @click.stop="deleteItem(item.id, item.name, item.unit)"></i>
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
        <el-form label-position="right" label-width="80px" :model="tempModalData" ref="paraForm" :rules="paraFormRules">
          <el-form-item label="Name" prop="name">
            <el-input v-model="tempModalData.name"></el-input>
          </el-form-item>
          <el-form-item label="Unit" prop="unit">
            <el-input v-model="tempModalData.unit"></el-input>
          </el-form-item>
          <div v-if="tempModalData.createdDate !== undefined">
            <span>Create Date: </span>
            <span>{{ tempModalData.createdDate }}</span>
          </div>
          <div v-if="tempModalData.lastModifiedDate !== undefined">
            <span>Last Modified Date: </span>
            <span>{{ tempModalData.lastModifiedDate }}</span>
          </div>
          <div v-if="tempModalData.id !== undefined">
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
  name: "parameterManagement",
  data() {
    return {
      loading: true,
      allParameterInfo: [],
      deviceModalStatus: false,
      deviceSelected: {},
      tempModalData: {},
      addOrUpdate: 0, // 0 for add 1 for update
      refresh: true,
      paraFormRules: {
        name: [
          {required: true, message: 'Please input parameter name', trigger: 'blur'},
        ],
        unit: [
          {required: true, message: 'Please input parameter unit', trigger: 'blur'},
        ],
      }
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
      api.paraAPI.getAllPara().then(res => {
        res = this.formatApi(res);
        if (res.status === 200) {
          this.loading = false;
          this.allParameterInfo = res.data;
        } else {
          this.$message({
            message: 'Error: Fetch Data fail',
            type: 'warning'
          });
          setTimeout(() => {
            this.initStateData(); // recursively try to fetch data
          }, 1000);
        }
      })

      // without api
      // this.allParameterInfo.forEach(device => {
      //   device.state = device.state === "ON";
      // });
    },

    deleteItem(id, serial, type) {
      this.$confirm('Confirm to Delete this ' + type + ' Parameter?', 'Delete', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.allParameterInfo = this.allParameterInfo.filter(item => item.id !== id);
        // with api
        api.paraAPI.deletePara(id).then(res => {
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
        // without api
        // this.allParameterInfo = this.allParameterInfo.filter(item => item.id !== id);
        // this.$message({
        //   type: 'success',
        //   message: 'Delete Success'
        // });
      }).catch(() => {
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
        name: "",
        unit: "",
      };
    },

    closeModal() {
      this.refreshList();
      this.deviceModalStatus = false;
    },

    confirmModal(code) {
      // with api
      this.$refs.paraForm.validate((valid) => {
        if (valid) {
          if (code === 0) { // add new
            this.allParameterInfo.push(this.tempModalData);
            api.paraAPI.addPara({
              name: this.tempModalData.name,
              unit: this.tempModalData.unit
            }).then(res => {
              if (res.status === 201) {
                this.refreshList();
                this.$message({
                  type: 'success',
                  message: 'Add New Parameter Success'
                });
                this.closeModal();
              } else {
                this.refreshList();
                this.$message({
                  type: 'warning',
                  message: 'Add New Parameter Failed'
                });
              }
            })
          }
          else if (code === 1) { // update
            const index = this.allParameterInfo.findIndex(item => item.id === this.tempModalData.id);
            if (index !== -1) {
              this.allParameterInfo[index] = this.tempModalData;
            }
            api.paraAPI.updatePara(this.tempModalData.id, {
              name: this.tempModalData.name,
              unit: this.tempModalData.unit,
            }).then(res => {
              if (res.status === 200) {
                this.refreshList();
                this.$message({
                  type: 'success',
                  message: 'Update Parameter Success'
                });
                this.closeModal();
              } else {
                this.refreshList();
                this.$message({
                  type: 'warning',
                  message: 'Update Parameter Failed'
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

div{
  font-family: Poppins,serif;
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
