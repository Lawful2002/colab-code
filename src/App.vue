<template>
  <div id="app">
    <TopNav @change-language="changeLang" />
    <keep-alive>
      <MonacoEditor
        :height="height"
        :width="width"
        :language="lang"
        :code="code"
        :editorOptions="options"
        :key="lang"
        @codeChange="onCodeChange"
      >
      </MonacoEditor>
    </keep-alive>
  </div>
</template>

<style>
body {
  margin: 0;
  overflow: hidden;
}
</style>

<script>
import MonacoEditor from "vue-monaco-editor";
import TopNav from "./components/layouts/TopNav.vue";

export default {
  mounted() {
    console.log("mounted")
    if (localStorage.getItem("code")) {
      this.code = localStorage.getItem("code")
      this.lang = localStorage.getItem("lang")
    }
    setInterval(() => {
      window.localStorage.setItem("code", this.savedCode)
      window.localStorage.setItem("lang", this.lang)
    },10 *1000);
  },
  updated() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  },
  data() {
    return {
      lang: "cpp",
      code: "//code here", //initial code
      savedCode: "",
      options: {
        selectOnLineNumbers: true,
      },
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  methods: {
    changeLang(language) {
      this.lang = language;
      this.code = "//code here"
    },
    onCodeChange(editorState) {
      this.savedCode = editorState.getValue();
    },
  },
  components: {
    MonacoEditor,
    TopNav,
  },
};
</script>