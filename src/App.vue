<template>
  <div id="app">
    <Modal @close-modal="closeModal" v-if="showModal">
      <template #heading> Upload Code </template>
      <template #body>
        <form>
          <div>
            <input
              class="form-control"
              type="file"
              id="formFile"
              ref="file"
              accept=".cpp, .cs, .py, .java, .txt, .html, .css, .js"
            />
            <div v-show="fileTypeError" class="error mt-2">
              Please select a valid file!
            </div>
          </div>
        </form>
      </template>
      <template #footer>
        <div
          class="d-flex flex-row justify-items-center justify-content-between"
        >
          <div>
            <button class="btn-success btn mb-2 mx-5" @click="getFile">
              Upload
            </button>
          </div>
          <div>
            <button class="btn-danger btn mx-5" @click="closeModal">
              Cancel
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <Modal @close-modal="closeWarningModal" v-if="showWarningModal">
      <template #heading> Clear Cache </template>
      <template #body
        >This will clear the locally stored code. Are you sure you want to
        continue?</template
      >
      <template #footer>
        <div
          class="d-flex flex-row justify-items-center justify-content-between"
        >
          <div>
            <button class="btn-danger btn mb-2 mx-5" @click="clearStore">
              Clear Cache
            </button>
          </div>
          <div>
            <button class="btn-primary btn mx-5" @click="closeWarningModal">
              Cancel
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <TopNav
      @change-language="changeLang"
      @save-code="saveCode"
      @upload="openModal"
      @clear-store="openWarningModal"
    />
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
<style scoped>
.error {
  color: red;
  text-align: center;
}
</style>

<script>
import MonacoEditor from "vue-monaco-editor";
import TopNav from "./components/layouts/TopNav.vue";
import { saveAs } from "file-saver";
import Extenstions from "./constants/fileExt";
import Modal from "./components/modals/Modal.vue";
import fileTypes from "./constants/extenstions";

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
    }, 5 * 1000);
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
      fileTypeError: false,
      showWarningModal: false,
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
    clearStore() {
      localStorage.clear();
      console.log("cache cleared");
      this.closeWarningModal()
    },
    getFile() {
      const file = this.$refs.file.files[0];
      const ext = this.$refs.file.files[0].name.split(".")[1];
      if (!fileTypes.includes(ext)) {
        this.fileTypeError = true;
      } else {
        this.fileTypeError = false;
        const fr = new FileReader();
        fr.readAsText(file);
        const that = this;
        fr.onload = () => {
          that.editor.setValue(fr.result);
          that.closeModal();
        };
      }
    },
    openWarningModal() {
      this.showWarningModal = true;
    },
    closeWarningModal() {
      this.showWarningModal = false;
    },
    openModal() {
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