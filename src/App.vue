<template>
  <div id="app">
    <TopNav 
      @change-language="changeLang"
    />
    <keep-alive>
    <MonacoEditor
      :height="height"
      :width="width"
      :language="lang"
      :code="code"
      :editorOptions="options"
      :key="lang"    
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
  updated() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  },
  data() {
    return {
      lang: "cpp",
      code: "//Write Your Code Here",
      options: {
        selectOnLineNumbers: true,
      },
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  methods: {
    changeLang(language) {
      this.lang = language
    },
  },
  components: {
    MonacoEditor,
    TopNav,
  },
};
</script>