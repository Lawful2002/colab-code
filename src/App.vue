<template>
  <div id="app">

    <Modal @close-modal="closeModal" v-if="showModal"></Modal>

    <TopNav @change-language="changeLang" @save-code="saveCode" @upload="openModal"/>
    <MonacoEditor
      :height="height"
      :width="width"
      :language="lang"
      :code="savedCode"
      :editorOptions="options"
      :key="lang"
      @codeChange="onCodeChange"
      @mounted="getEditor"
    >
    </MonacoEditor>
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
import { saveAs } from "file-saver";
import Extenstions from "./constants/fileExt";
import Modal from "./components/modals/Modal.vue";

export default {
  mounted() {
    console.log("mounted");
    if (localStorage.getItem("code")) {
      this.code = localStorage.getItem("code");
      this.lang = localStorage.getItem("lang");
      this.savedCode = this.code;
    }
    setInterval(() => {
      window.localStorage.setItem("code", this.savedCode);
      window.localStorage.setItem("lang", this.lang);
    }, 10 * 1000);
  },
  unmount() {
    window.localStorage.setItem("code", this.savedCode);
    window.localStorage.setItem("lang", this.lang);
  },
  updated() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  },
  data() {
    return {
      showModal: false,
      lang: undefined,
      savedCode: "//code here",
      options: {
        selectOnLineNumbers: true,
      },
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  methods: {
    openModal(){
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveCode() {
      let ext = Extenstions[this.lang];
      let filename = `colab-code-${Date.now()}.${ext}`;
      const blob = new Blob([this.savedCode]);
      saveAs(blob, filename);
      alert("Code Saved!");
    },
    getEditor(editor) {
      this.editor = editor;
    },
    changeLang(language) {
      this.lang = language;
      this.code = "//code here";
    },
    onCodeChange(editorState) {
      this.editor = editorState;
      this.savedCode = editorState.getValue();
    },
  },
  components: {
    MonacoEditor,
    TopNav,
    Modal,
  },
};
</script>