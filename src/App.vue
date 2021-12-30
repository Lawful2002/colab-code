<template>
  <div id="app">
    <Modal v-if="showModal">
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

    <Modal v-if="showWarningModal">
      <template #heading> Clear Cache </template>
      <template #body>
        <p>This will clear the locally stored code.</p>
        <p>Are you sure you want to continue?</p></template
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

    <Modal v-if="showRunModal">
      <template #heading> Run your Code </template>
      <template #body>
        <div class="input-group mb-2">
          <span class="input-group-text">STDIN</span>
          <textarea class="form-control" aria-label="STDIN" rows="2" v-model="input"></textarea>
        </div>
        <div class="input-group">
          <span class="input-group-text">STDOUT</span>
          <textarea
            class="form-control"
            aria-label="STDOUT"
            readonly
            rows="2"
            v-model="output"
          ></textarea>
        </div>
      </template>
      <template #footer>
        <div
          class="d-flex flex-row justify-items-center justify-content-between"
        >
          <div>
            <button
              class="btn-success btn mb-2 mx-5"
              @click="runCode"
              :disabled="runDisabled"
              :title="runMessage"
            >
              {{ this.runMessage }}
            </button>
          </div>
          <div>
            <button class="btn-danger btn mx-5" @click="closeRunModal">
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
      @run-code="openRunModal"
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
p {
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
import runtimes from "./constants/runtimes";
import Axios from "axios";

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
      runMessage: "Run",
      input: "",
      runDisabled: false,
      output: undefined,
      showRunModal: false,
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
    async runCode() {
      this.output = "Running....."
      const body = {
        language: runtimes[this.lang][0],
        version: runtimes[this.lang][1],
        files: [
          {
            content: this.savedCode,
          },
        ],
        stdin: this.input,
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      };

      Axios.post("https://emkc.org/api/v2/piston/execute", body)
        .then((res) => {
          this.output = res.data.run.output;
        })
        .catch((e) => {
          console.log(e);
        });
      
      this.runDisabled = true;
      this.runMessage = "Wait"
      setTimeout(()=>{
        this.runDisabled = false;
        this.runMessage = 'Run'
      }, 5000)

    },
    clearStore() {
      localStorage.clear();
      console.log("cache cleared");
      this.closeWarningModal();
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
    openRunModal() {
      this.showRunModal = true;
    },
    closeRunModal() {
      this.showRunModal = false;
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
      if (runtimes[this.lang]) {
        this.runDisabled = false;
        this.runMessage = "Run"
      } else {
        this.runDisabled = true;
        this.runMessage = "Unsupported Language"
      }
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