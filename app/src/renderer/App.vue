<template lang="pug">
  Layout
    Row.fixed
      Col(span="24"): div: div.arrow-up
      Col(span="24")
        Header
          a(@click="passages = []" v-if="passages.length > 0"): Icon(type="ios-trash" size="20")
          Input(v-model="query" @keyup.enter.native="search(query)" placeholder="Enter a Bible reference (e.g. John 3:16)")
          Spin(type="small" v-if="isLoading")
      Col(span="24")
        Content
          Row
            Col(span="24" v-if="reversedPassages.length === 0")
              Alert(show-icon)
                | Examples
                template(slot="desc"): p
                  i Jn11.35
                  br
                  i Genesis 1-11
                  br
                  i Ps1,3
                  br
                  i john 3:16, hebrews 11:8
            Col(span="24"): div(v-for="(passage, key) in reversedPassages"): Card
                p(slot="title") {{passage.canonical}}
                a(slot="extra" @click="reversedPassages.splice(key, 1)"): Icon(type="close-round" size="15")
                div(v-for="partial in passage.passages"): p(v-html="partial")
        Footer: Row
            Col(span="12"): a(href="#" @click.prevent="openCopyright" target="_blank") ESV
            Col(span="12"): a(href="#" @click.prevent="exit"): Icon.pull-right(type="power" size="20")
            //- Col(span="12"): a(href="#" @click="about"): Icon.pull-right(type="gear-b" size="20")
</template>

<style lang="scss">
body {
  background: transparent;
}

.ivu-layout {
  background: transparent;

  .fixed {
    position: fixed;
    width: 100%;
  }
  .ivu-layout-header {
    margin-top: 10px;

    a {
      position: absolute;
      top: 16px;
      left: 22px;
      color: #dddee1;
    }
    .ivu-spin {
      position: absolute;
      top: 33px;
      right: 61px;
    }
  }
  .ivu-layout-content {
    padding: 11px;
    background-color: #f8f8f9;
    height: 450px;
    overflow-y: scroll;
    .ivu-card {
      margin-top: 5px;
    }
  }

  .ivu-layout-footer {
    padding: 10px;
    border-top: 1px solid #dddee1;

    .ivu-icon {
      color: #495060;
    }
  }
}
.pull-right {
  float: right;
}
.bg-light-border {
  background-color: #e4e7ed;
}
.bg-extra-light {
  background-color: #e4e7ed;
}
.arrow-up {
  position: absolute;
  left: 209px;
  width: 0;
  height: 0;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-bottom: 16px solid #495060;
}
.text-center {
  text-align: center;
}
body {
  margin: 0px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun,
    sans-serif;
  font-weight: 400;
}
</style>

<script>
import axios from "axios";
import { shell, remote } from "electron";
import openAboutWindow from "about-window";
import { debounce, isEmpty } from "lodash";

export default {
  data() {
    return {
      isLoading: false,
      passages: [],
      query: ""
    };
  },
  computed: {
    reversedPassages() {
      return this.passages.reverse();
    }
  },
  methods: {
    exit() {
      remote.process.exit(1);
    },
    about() {
      openAboutWindow({
        icon_path: "assets/logo.png",
        product_name: "asdf"
      });
    },
    openCopyright() {
      shell.openExternal("https://www.esv.org/");
    },
    search(query) {
      this.isLoading = true;
      axios.get(`${process.env.endpoint}/query=${query}`).then(res => {
        if (!isEmpty(res.data.canonical)) {
          this.passages.push(res.data);
          this.isLoading = false;
          this.query = "";
        }
      });
    }
  }
};
</script>
