<template>
  <div style="background-color: #eee">
    <div class="operations">
      <el-row>
        <el-col :offset="4" :span="8">
          <el-button @click="empty">Add User</el-button>
          <el-button @click="enableUser">Enable User</el-button>
          <el-button @click="disableUser">Disable User</el-button>
          <el-button @click="deleteSelection">Delete User</el-button>
        </el-col>
        <el-col :span="6">
          <el-input v-model="searchInput" placeholder="Please Input Search Keywords" clearable @change="clearSearch(searchInput)">
            <el-button slot="append" icon="el-icon-search" @click="search4Input(searchInput)"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="table-wrapper">
      <Table border ref="table" :columns="columns" :data="chartDisplayData" @on-selection-change="testSelect" no-data-text="No Data">
        <template #action="{ index }">
          <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
          <Button type="error" size="small" @click="remove(index)">Delete</Button>
        </template>
      </Table>
    </div>

  </div>
</template>

<script>
export default {
  name: "userManagement",
  data() {
    return {
      searchInput: "",
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'Date',
          key: 'date',
          sortable: true
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age',
          sortable: true
        },
        {
          title: 'Address',
          key: 'address'
        },
        {
          title: 'Status',
          key: 'status'
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
      chartSelection: [],
    }
  },
  methods: {
    empty() {

    },
    initDisplayData(){
      this.chartDisplayData = this.chartData;
    },
    testSelect(selection) {
      this.chartSelection = selection;
      console.log(selection);
    },
    show(index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.chartData[index].name}<br>Age：${this.chartData[index].age}<br>Address：${this.chartData[index].address}`
      })
    },
    remove(index) {
      this.chartData.splice(index, 1);
    },
    deleteSelection() {
      for (let i = 0; i < this.chartSelection.length; i++) {
        this.chartData = this.chartData.filter((item) => item.name !== this.chartSelection[i].name);
      }
    },
    enableUser() {
      for (let i = 0; i < this.chartSelection.length; i++) {
        this.chartData.filter((item) => item.name === this.chartSelection[i].name)[0].status = 'Enable';
      }
    },
    disableUser() {
      for (let i = 0; i < this.chartSelection.length; i++) {
        this.chartData.filter((item) => item.name === this.chartSelection[i].name)[0].status = 'Disable';
      }
    },
    search4Input(keyword) {
      if (keyword === "" || keyword === null) {
        this.initDisplayData();
        return;
      } else {
        keyword = keyword.toUpperCase();
      }
      this.chartDisplayData = [];
      for (let i = 0; i < this.chartData.length; i++) {
        if (this.chartData[i].name.toUpperCase().indexOf(keyword) !== -1) {
          console.log(this.chartData[i]);
          this.chartDisplayData.push(this.chartData[i]);
        }
      }
    },
    clearSearch(keyword){
      if (keyword === "" || keyword === null) {
        this.initDisplayData();
      }
    }
  },
  created() {
    this.initDisplayData();
  }
}
</script>

<style scoped>

</style>
