<template>
  <div class="aui-wrapper aui-page__login">
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <div class="login-header">
          <h2 class="login-brand">{{ $t("brand.lg") }}</h2>
        </div>
        <div class="login-body">
          <h3 class="login-title">{{ $t("login.title") }}</h3>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmitHandle()"
            status-icon
          >
            <el-form-item>
              <el-select v-model="$i18n.locale" class="w-percent-100">
                <el-option
                  v-for="(val, key) in i18nMessages"
                  :key="key"
                  :label="val._lang"
                  :value="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="username">
              <el-input
                v-model="dataForm.username"
                :placeholder="$t('login.username')"
              >
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true">
                    <use xlink:href="#icon-user"></use>
                  </svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="dataForm.password"
                type="password"
                :placeholder="$t('login.password')"
              >
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true">
                    <use xlink:href="#icon-lock"></use>
                  </svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="dataFormSubmitHandle()"
                class="w-percent-100"
                >{{ $t("login.title") }}</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="login-footer">
          <p>
            <a
              href="https://demo.renren.io/security-enterprise"
              target="_blank"
              >{{ $t("login.demo") }}</a
            >
          </p>
          <p>
            <a href="https://www.renren.io/" target="_blank">{{
              $t("login.copyright")
            }}</a
            >2021 © renren.io
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import debounce from "lodash/debounce";
import { messages } from "@/i18n";
import { getUUID } from "@/utils";
export default {
  data() {
    return {
      i18nMessages: messages,
      dataForm: {
        username: "",
        password: "",
        uuid: "",
      },
    };
  },
  computed: {
    dataRule() {
      return {
        username: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur",
          },
        ],
      };
    },
  },
  created() {
    this.dataForm.uuid = getUUID();
  },
  methods: {
    encode64(input) {
      var keyStr =
        "ABCDEFGHIJKLMNOP" +
        "QRSTUVWXYZabcdef" +
        "ghijklmnopqrstuv" +
        "wxyz0123456789+/" +
        "=";
      var output = "";
      var chr1,
        chr2,
        chr3 = "";
      var enc1,
        enc2,
        enc3,
        enc4 = "";
      var i = 0;
      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output =
          output +
          keyStr.charAt(enc1) +
          keyStr.charAt(enc2) +
          keyStr.charAt(enc3) +
          keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);
      return output;
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs["dataForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          console.log(this.encode64(this.dataForm.password));
          let dataForm = {
            username: this.dataForm.username,
            password: this.encode64(this.dataForm.password),
            uuid: this.dataForm.uuid,
          };
          this.$http
            .post("/login", dataForm)
            .then(({ data: res }) => {
              if (res.code !== 200) {
                return this.$message.error(res.msg);
              }
              Cookies.set("token", res.data.token);
              this.$router.replace({ name: "home" });
            })
            .catch(() => {});
        });
      },
      1000,
      { leading: true, trailing: false }
    ),
  },
};
</script>
