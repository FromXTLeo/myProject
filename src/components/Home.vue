<template>
  <el-container class="home_container">
    <el-header class="home_header">
      <div>
        <h1>管理系统</h1>
      </div>
      <div>
        <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        ></el-avatar>
        <span>admin</span>
        <span class="logout" @click="handleLogout">退出</span>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'" class="home_aside">
        <div class="home_aside_switch" @click="switchAside">|||</div>
        <el-menu
          background-color="#24292e"
          text-color="#ddd"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <el-submenu
            :index="items.id + ''"
            v-for="items in asideMenu"
            :key="items.id"
          >
            <template slot="title">
              <i :class="asideMenuIcons[items.id]"></i>
              <span>{{ items.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + item.path"
              v-for="item in items.children"
              :key="item.id"
              ><template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home_main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      asideMenu: {},
      asideMenuIcons: {
        // eslint-disable-next-line quote-props
        '125': 'iconfont icon-user',
        // eslint-disable-next-line quote-props
        '103': 'iconfont icon-tijikongjian',
        // eslint-disable-next-line quote-props
        '101': 'iconfont icon-shangpin',
        // eslint-disable-next-line quote-props
        '102': 'iconfont icon-danju',
        // eslint-disable-next-line quote-props
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created() {
    this.getAsideData()
  },
  methods: {
    async getAsideData() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.asideMenu = res.data
    },
    handleLogout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    switchAside() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
  .home_header {
    background-color: #24292e;
    color: #ddd;
    display: flex;
    justify-content: space-between;
    > div {
      display: flex;
      align-items: center;
      .logout {
        cursor: pointer;
      }
      > span {
        margin: 0 5px;
      }
    }
  }
  .home_aside {
    background-color: #24292e;
    color: #ddd;
    .home_aside_switch {
      text-align: center;
      cursor: pointer;
      padding: 5px 8px 5px 0px;
    }
    .iconfont {
      margin-right: 5px;
    }
    .el-menu {
      border-right: none;
    }
  }
  .home_main {
    background-color: #ddd;
  }
}
</style>
