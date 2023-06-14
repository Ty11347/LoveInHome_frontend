<template>
  <div style="background-color: #bcd6d2">
    <div class="operations">
      <el-row>
        <el-col :offset="4" :span="8">
          <el-button @click="addUser">Add User</el-button>
          <el-button @click="deleteSelection">Delete User</el-button>
        </el-col>
        <el-col :span="6">
          <el-input v-model="searchInput" placeholder="Search for Username" clearable
                    @change="clearSearch(searchInput)">
            <el-button slot="append" icon="el-icon-search" @click="search4Input(searchInput)"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="table-wrapper" v-if="refresh">
      <Table border ref="table" :columns="columns" :data="chartDisplayData" @on-selection-change="testSelect"
             no-data-text="No Data" v-if="refresh">
        <template slot-scope="{ row, index }" slot="admin">
          <el-switch v-model="row.isAdmin" @change="updateUser(row, index)"></el-switch>
        </template>
        <template slot-scope="{ row, index }" slot="active">
          <el-switch v-model="row.isActive" @change="updateUser(row, index)"></el-switch>
        </template>
        <template slot-scope="{ index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
          <Button type="error" size="small" @click="remove(index)">Delete</Button>
        </template>
      </Table>
    </div>

    <Modal v-model="userModalStatus" draggable sticky width="560">
      <template #header>
        <p style="text-align:center">
          <span>User Info</span>
        </p>
      </template>
      <div>
        <el-form label-position="right" label-width="140px" :model="tempModalData" :rules="userFormRules" ref="userForm">
          <el-form-item label="Username" prop="username">
            <el-input v-model="tempModalData.username"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="tempModalData.email"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="tempModalData.password"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Active this user">
                <el-switch v-model="tempModalData.isActive"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Set as house admin">
                <el-switch v-model="tempModalData.isAdmin"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="text-align: center" v-if="tempModalData.id !== undefined">
            <span>User ID </span>
            <span style="font-family: Courier New,monospace; font-weight: 600">{{ tempModalData.id }}</span>
          </div>
          <div style="text-align: center" v-if="tempModalData.createdDate !== undefined">
            <span>Created Date {{ tempModalData.createdDate }}</span>
          </div>
          <div style="text-align: center" v-if="tempModalData.lastModifiedDate !== undefined">
            <span>Last Modified Date {{ tempModalData.lastModifiedDate }}</span>
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
  name: "userManagement",
  data() {
    return {
      refresh: true,
      userModalStatus: false,
      searchInput: "",
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'Username',
          key: 'username',
          sortable: true
        },
        {
          title: 'Email',
          key: 'email',
          sortable: true
        },
        {
          title: 'Created Date',
          key: 'createdDate',
          sortable: true
        },
        {
          title: 'Admin',
          slot: 'admin',
          key: 'isAdmin',
          sortable: true
        },
        {
          title: 'Active',
          slot: 'active',
          key: 'isActive',
          sortable: true
        },
        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      chartDisplayData: [],
      chartData: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03',
          status: 'Enable'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01',
          status: 'Enable'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02',
          status: 'Enable'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04',
          status: 'Enable'
        }
      ],
      // chartData: [
      //   {
      //     "id": "64817ce4194c821ca609cdbd",
      //     "createdDate": "2023-06-08T07:01:56.371Z",
      //     "lastModifiedDate": "2023-06-08T09:42:22.695Z",
      //     "username": "test_update",
      //     "password": "password124",
      //     "email": "zhan@example.com",
      //     "isAdmin": true,
      //     "isActive": true
      //   },
      //   {
      //     "id": "64818fc1194c821ca609cdbf",
      //     "createdDate": "2023-06-08T08:22:25.062Z",
      //     "lastModifiedDate": "2023-06-08T09:29:27.363Z",
      //     "username": "ty",
      //     "password": "password12",
      //     "email": "ty@example.com",
      //     "isAdmin": true,
      //     "isActive": false
      //   },
      //   {
      //     "id": "64819e5e4a83ac2743161667",
      //     "createdDate": "2023-06-08T09:24:46.747Z",
      //     "lastModifiedDate": "2023-06-08T09:24:46.747Z",
      //     "username": "1",
      //     "password": "1",
      //     "email": "test@example.com",
      //     "isAdmin": true,
      //     "isActive": true
      //   }
      // ],
      chartSelection: [],
      tempModalData: {},
      addOrUpdate: 0,
      userFormRules: {
        username: [
          {required: true, message: 'Please input username', trigger: 'blur'}
        ],
        email: [
          {required: true, message: 'Please input email address', trigger: 'blur'},
          {type: 'email', message: 'Please input correct Email address', trigger: ['blur', 'change']}
        ],
        password: [
          {required: true, message: 'Please input password', trigger: 'blur'},
          {min: 8, max: 16, message: 'Password length should be 8 to 16 characters', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    empty() {

    },
    closeModal() {
      this.userModalStatus = false;
    },

    addUser() {
      this.userModalStatus = true;
      this.addOrUpdate = 0;
    },

    updateUser(row) {
      this.tempModalData = row;
      this.confirmModal(1);
    },

    confirmModal(code) {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          if (code === 1) {
            console.log(this.chartDisplayData);
            console.log(this.tempModalData);
            const index = this.chartDisplayData.findIndex(item => item.id === this.tempModalData.id);
            if (index !== -1) {
              this.chartDisplayData[index] = this.tempModalData;
            }
            api.userAPI.updateUser(this.tempModalData.id, {
              username: this.tempModalData.username,
              password: this.tempModalData.password,
              email: this.tempModalData.email,
              isActive: this.tempModalData.isActive,
              isAdmin: this.tempModalData.isAdmin
            }).then(res => {
              console.log(res);
              if (res.status === 200) {
                this.$message({
                  type: 'success',
                  message: 'Update Success'
                });
                this.closeModal();
                this.refreshPage();
              } else {
                this.refreshPage();
                this.$message({
                  type: 'warning',
                  message: 'Update Failed'
                });
              }
            })
          }
          else if (code === 0) {
            this.chartDisplayData.push(this.tempModalData);
            api.userAPI.addUser({
              username: this.tempModalData.username,
              password: this.tempModalData.password,
              email: this.tempModalData.email,
              isActive: this.tempModalData.isActive,
              isAdmin: this.tempModalData.isAdmin
            }).then(res => {
              if (res.status === 201) {
                this.$message({
                  type: 'success',
                  message: 'Add New User Success'
                });
                this.closeModal();
                this.refreshPage();
              } else {
                this.refreshPage();
                this.$message({
                  type: 'warning',
                  message: 'Add New User Failed'
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
    processDate(str) {
      return JSON.stringify(str).replace(/T/g, " @ ")
          .replace(/Z/g, "")
          .slice(1, 22);
    },
    async initDisplayData() {
      var res = await api.userAPI.getAllUser();
      if (res.status === 200) {
        res.data.forEach(item => {
          console.log(typeof item.createdDate);
          console.log(item.createdDate);
          item.createdDate = this.processDate(item.createdDate);
          item.lastModifiedDate = this.processDate(item.lastModifiedDate);
        })
        console.log(res.data);
        this.chartData = this.dcp(res.data);
      } else {
        this.$message({
          message: 'Error: Fetch Data fail',
          type: 'warning'
        });
      }
      this.chartDisplayData = this.dcp(this.chartData);
    },
    testSelect(selection) {
      this.chartSelection = selection;
      console.log(selection);
    },
    show(index) {
      this.addOrUpdate = 1;
      this.tempModalData = this.chartDisplayData[index];
      this.userModalStatus = true;
    },
    remove(index) {
      this.deleteSelection(this.chartDisplayData[index].id)
      this.chartDisplayData.splice(index, 1);
    },
    deleteSelection(id) {
      this.$confirm('Confirm to Delete?', 'Delete', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        if (typeof id === "string") {
          api.userAPI.deleteUser(id).then(res => {
            if (res.status === 200) {
              this.refreshPage();
              this.$message({
                type: 'success',
                message: 'Delete Success'
              });
            } // if status is not 200, show an error message
            else {
              this.refreshPage();
              this.$message({
                type: 'warning',
                message: 'Error: Delete Fail'
              });
            }
          })
        } else {
          console.log(this.chartSelection);
          for (let i = 0; i < this.chartSelection.length; i++) {
            this.chartDisplayData = this.chartDisplayData.filter((item) => item.username !== this.chartSelection[i].username);
            api.userAPI.deleteUser(this.chartSelection[i].id).then(res => {
              console.log(res.status);
              if (res.status === 200) {
                this.refreshPage();
                this.$message({
                  type: 'success',
                  message: 'Delete Success'
                });
              } // if status is not 200, show an error message
              else {
                this.refreshPage();
                this.$message({
                  type: 'warning',
                  message: 'Error: Delete Fail'
                });
              }
            })
          }
        }
      }).catch(() => {
        this.refreshPage();
        this.$message({
          type: 'info',
          message: 'Cancel Delete'
        });
      });

    },
    async search4Input(keyword) {
      if (keyword === "" || keyword === null) {
        await this.initDisplayData();
        return;
      } else {
        keyword = keyword.toUpperCase();
      }
      this.chartDisplayData = [];
      for (let i = 0; i < this.chartData.length; i++) {
        if (this.chartData[i].username.toUpperCase().indexOf(keyword) !== -1) {
          console.log(this.chartData[i]);
          this.chartDisplayData.push(this.chartData[i]);
        }
      }
    },
    async clearSearch(keyword) {
      if (keyword === "" || keyword === null) {
        await this.initDisplayData();
      }
    },

    dcp(obj) {
      return JSON.parse(JSON.stringify(obj));
    },

    refreshPage() {
      // console.log(this.chartData);
      // console.log(this.chartDisplayData);
      // this.chartDisplayData = this.chartData;
      // console.log(this.chartDisplayData);
      this.refresh = !this.refresh;
      this.refresh = !this.refresh;
      this.initDisplayData();
    }
  },
  async created() {
    await this.initDisplayData();
  }
}
</script>

<style scoped>
.table-wrapper {
  width: 80%;
  margin: 3vh auto;
  border-radius: 10px;
  box-shadow: 0 0 6px 3px rgba(0, 0, 0, 0.1);
}

.ivu-table-wrapper-with-border {
  border-radius: 10px !important;
}
</style>
