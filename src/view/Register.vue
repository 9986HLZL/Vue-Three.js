<template>
  <div>
    <div class="top">
      <img src="../assets/logo.png" />
    </div>
    <div class="register">
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
        <el-form-item label="姓名" prop="name">
          <el-input
            type="text"
            v-model="ruleForm.name"
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
        <el-form-item label="电话" prop="phone">
          <el-input
            type="text"
            v-model="ruleForm.phone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input
            type="text"
            v-model="ruleForm.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="medium" @click="register"
            >确认注册</el-button
          >
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
  name: "Register",
  data() {
    return {
      ruleForm: {
        id: "",
        name: "",
        pass: "",
        role: "",
        phone: "",
        email: "",
      },
      rules: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        id: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
        // phone: [
        //   { required: true, message: "手机号不能为空", trigger: "blur" },
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: "请输入正确的手机号码",
        //     trigger: "blur",
        //   },
        // ],
        // email:[
        //     { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        //     {
        //       type: 'email',
        //       message: '请输入正确的邮箱地址',
        //       trigger: ['blur', 'change'],
        //     },
        //   ]
      },
    };
  },
  methods: {
    register() {
      this.$axios
        .get("http://127.0.0.1/register/get", {
          params: {
            form: this.ruleForm,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.data.status == 200) {
            this.$message.success("注册成功");
            this.$router.push({
              path: "/login",
            });
          }
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
.register {
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