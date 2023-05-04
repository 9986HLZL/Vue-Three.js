<template>
  <!-- <v-parallax
    dark
    src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        class="text-center"
        cols="12"
      >
        <h1 class="text-h4 font-weight-thin mb-4">
          Vuetify
        </h1>
        <h4 class="subheading">
          Build your application today!
        </h4>
      </v-col>
    </v-row>
  </v-parallax> -->
  <div>
    <div class="top">
      <img src="../assets/logo.png" />
    </div>
    <div class="login">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="id">
          <el-input
            type="text"
            v-model="ruleForm.id"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            show-password
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            show-password
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <vue-particles
        class="login-bg"
        color="#39AFFD"
        :particleOpacity="0.7"
        :particlesNumber="100"
        shapeType="circle"
        :particleSize="4"
        linesColor="#8DD1FE"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      ruleForm: {
        id: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        id: [{ required: true, message: "请输入账号", trigger: "blur" }],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPass: [{ required: true, message: "请确认密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    login() {
      // console.log('@@@login');
      if (this.ruleForm.id === "") {
        alert("请输入用户名和密码");
      } else if (this.ruleForm.pass === this.ruleForm.checkPass) {
        this.$axios
          .get("http://127.0.0.1/user/get", {
            params: { id: this.ruleForm.id, pass: this.ruleForm.pass },
          })
          .then((res) => {
            console.log("res", res);
            if (res.data.status == 200) {
              sessionStorage.setItem("ActiveUser", JSON.stringify(res.data.id)); //将当前登录用户信息存入会话存储空间
              this.$router.replace({
                name: "Factory",
              });
              this.$message.success("登录成功");
            }
            if (res.data.status == 202) {
              this.$message.error("用户名或密码错误");
            }
          });
      } else {
        this.$message.error("请重新确认密码");
      }
    },
    register() {
      this.$router.push({
        name: "register",
      });
    },
  },
};
</script>

<style>
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: rgb(239, 239, 239);
}
.lizi {
  position: fixed;
  top: 0;
  width: 100%;
}
.login {
  position: absolute;
  left: 34%;
  top: 40%;
  width: 400px;
}
.top {
  border: 10px solid #fff;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #eeeeee;
  box-shadow: 0px 0px 10px #fff;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.top img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>