<template>
  <div class="view-wrapper">
    <div class="device-title">
      Devices
      <el-button style="margin-left: auto" @click="addDevice">Add Device</el-button>
    </div>
    <div class="device-item-wrapper">
      <div v-for="item in allDeviceInfo" :key="item.id" class="device-item" @click="clickDevice(item)">
        <el-row>
          <el-col :span="16">
            <div style="display: flex">
              <div class="device-serial-text">
                <div class="device-item-title-text">Serial Number:</div>
                <div class="device-item-text">{{ item.serialNum }}</div>
              </div>
              <div class="device-type-text">
                <div class="device-item-title-text">Type of Device:</div>
                <div class="device-item-text">{{ item.type }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6" style="line-height: 12vh; text-align: right">
            <div class="device-state-text">Device Status</div>
            <el-switch
                v-model="item.state"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
          </el-col>
          <el-col :span="2" class="device-delete-btn">
            <i class="el-icon-close" @click.stop="deleteItem(item.id, item.serialNum, item.type)"></i>
          </el-col>
        </el-row>
      </div>
    </div>

    <Modal v-model="deviceModalStatus" draggable sticky width="360">
      <template #header>
        <p style="text-align:center">
          <span>Device Info</span>
        </p>
      </template>
      <div>
        <el-form label-position="right" label-width="auto" :model="tempModalData">
          <el-form-item label="Serial Number">
            <el-input v-model="tempModalData.serialNum"></el-input>
          </el-form-item>
          <el-form-item label="Device Type">
            <el-input v-model="tempModalData.type"></el-input>
          </el-form-item>
          <el-form-item label="Device State">
            <el-switch v-model="tempModalData.state"></el-switch>
          </el-form-item>
          <div style="text-align: center" v-if="tempModalData.id !== undefined">
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
      allDeviceInfo: [
        {
          id: "64576fef71c9d22b63f0aa516",
          createdDate: null,
          lastModifiedDate: "2023-05-20T17:54:41.670Z",
          serialNum: "ABC123333333333333333333",
          type: "Resberry pi 4",
          state: "OFF"
        },
        {
          id: "6463434844542d8ab0b242ac",
          createdDate: null,
          lastModifiedDate: null,
          serialNum: "DEF123",
          type: "Resberry pi 4",
          state: "ON"
        },
        {
          id: "6463515110252f6ef413c733",
          createdDate: null,
          lastModifiedDate: null,
          serialNum: "QWE123",
          type: "Smart Device",
          state: "ON"
        },
        {
          id: "64635238702d254e6d013b5a",
          createdDate: "2023-05-16T17:51:52.619Z",
          lastModifiedDate: "2023-05-16T17:51:52.619Z",
          serialNum: "QWE123",
          type: "Smart Device",
          state: "ON"
        }, {
          id: "64576fef71c9d22b63f0aa356",
          createdDate: null,
          lastModifiedDate: "2023-05-20T17:54:41.670Z",
          serialNum: "ABC123",
          type: "Resberry pi 4",
          state: "OFF"
        }, {
          id: "64576fef71c9d22b63f0aa564",
          createdDate: null,
          lastModifiedDate: "2023-05-20T17:54:41.670Z",
          serialNum: "ABC123",
          type: "Resberry pi 4",
          state: "OFF"
        }, {
          id: "64576fef71c9d22b63f0aa565",
          createdDate: null,
          lastModifiedDate: "2023-05-20T17:54:41.670Z",
          serialNum: "ABC123",
          type: "Resberry pi 4",
          state: "OFF"
        }, {
          id: "64576fef71c9d22b63f0aa456",
          createdDate: null,
          lastModifiedDate: "2023-05-20T17:54:41.670Z",
          serialNum: "ABC123",
          type: "Resberry pi 4",
          state: "OFF"
        }, {
          id: "64576fef71c9d22b63f0aa556",
          createdDate: null,
          lastModifiedDate: "2023-05-20T17:54:41.670Z",
          serialNum: "ABC123",
          type: "Resberry pi 4",
          state: "OFF"
        },
      ],
      deviceModalStatus: false,
      deviceSelected: {},
      tempModalData: {},
      addOrUpdate: 0, // 0 for add 1 for update
    }
  },
  watch: {},
  methods: {
    empty() {

    },
    formatApi(data) {
      return JSON.parse(JSON.stringify(data))
    },
    // format all device data and store to local variable: this.allDeviceInfo
    initStateData() {
      // with api
      // api.getAllDevice().then(res => {
      //   res = this.formatApi(res);
      //   if (res.status === 200) {
      //     this.allDeviceInfo = res.data;
      //     this.allDeviceInfo.forEach(device => {
      //       device.state = device.state === "ON";
      //     });
      //   } else {
      //     this.$message({
      //       message: 'Error: Fetch Data fail',
      //       type: 'warning'
      //     });
      //     setTimeout(() => {
      //       this.initStateData(); // recursively try to fetch data
      //     }, 1000);
      //   }
      // })

      // without api
      this.allDeviceInfo.forEach(device => {
        device.state = device.state === "ON";
      });
    },

    deleteItem(id, serial, type) {
      this.$confirm('Confirm to Delete this ' + type + ' Device?', 'Delete', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // with api
        // api.deleteDevice(id).then(res => {
        //   // if status code is 200, format all device data and store to local variable: this.allDeviceInfo
        //   if (res.status === 200) {
        //     this.initStateData();
        //     this.$message({
        //       type: 'success',
        //       message: 'Delete Success'
        //     });
        //   } // if status is not 200, show an error message
        //   else {
        //     this.$message({
        //       type: 'warning',
        //       message: 'Error: Delete Fail'
        //     });
        //   }
        // }).catch(() => {
        //   // if user cancel delete, show message
        //   this.$message({
        //     type: 'info',
        //     message: 'Cancel Delete'
        //   });
        // });

        // without api
        this.allDeviceInfo = this.allDeviceInfo.filter(item => item.id !== id);
        this.$message({
          type: 'success',
          message: 'Delete Success'
        });
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
        serialNum: "",
        type: "",
        state: true
      };
    },

    closeModal() {
      this.deviceModalStatus = false;
    },

    confirmModal(code) {
      // with api
      // if (code === 0){
      //   api.addDevice( {
      //     serialNum: this.tempModalData.serialNum,
      //     type: this.tempModalData.type,
      //     state: this.tempModalData.state? "ON" : "OFF"
      //   }).then(res => {
      //     if (res.status === 200){
      //       this.$message({
      //         type: 'success',
      //         message: 'Add New Device Success'
      //       });
      //       this.closeModal();
      //     } else {
      //       this.$message({
      //         type: 'warning',
      //         message: 'Add New Device Failed'
      //       });
      //     }
      //   })
      // } else if (code === 1){
      //   api.updateDevice(this.tempModalData.id, {
      //     serialNum: this.tempModalData.serialNum,
      //     type: this.tempModalData.type,
      //     state: this.tempModalData.state? "ON" : "OFF"
      //   }).then(res => {
      //     if (res.status === 200){
      //       this.$message({
      //         type: 'success',
      //         message: 'Update Success'
      //       });
      //       this.closeModal();
      //     } else {
      //       this.$message({
      //         type: 'warning',
      //         message: 'Update Failed'
      //       });
      //     }
      //   })
      // }
      console.log(this.tempModalData);

      // without api
      if (code === 1) {
        const index = this.allDeviceInfo.findIndex(item => item.id === this.tempModalData.id);
        if (index !== -1) {
          this.allDeviceInfo[index] = this.tempModalData;
        }
      } else {
        console.log(this.tempModalData);
      }

      this.closeModal();
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
}

.device-delete-btn:hover {
  color: black;
  font-size: 3.5vh;
  transition: color, font-size 0.2s linear;
  cursor: pointer;
}

#confirm-btn {
  background-color: #bcd6d2;
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
