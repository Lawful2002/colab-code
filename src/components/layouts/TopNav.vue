<template>
  <div class="topnav d-flex align-items-center justify-content-between">
    <div>
      <select
        v-on:change="langChange"
        class="form-select m-2"
        aria-label="Select language"
        ref="lang"
      >
        <option value="cpp" selected>C++</option>
        <option value="javascript">Javascript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="csharp">C#</option>
      </select>
    </div>

    <div class="d-flex justify-content-center align-items-center">
      <b-icon
        title="Run"
        class="round mx-2"
        icon="play-circle"
        variant="secondary"
      ></b-icon>
      <b-icon
        title="Upload Code"
        class="round mx-2"
        icon="file-earmark-arrow-up"
        variant="secondary"
      ></b-icon>
      <b-icon
        title="Download Code"
        class="round mx-2"
        icon="file-earmark-arrow-down"
        variant="secondary"
        @click="saveCode"
      ></b-icon>
      <b-icon
        title="Colab Mode"
        class="round mx-2"
        icon="people-fill"
        variant="secondary"
      ></b-icon>
      <b-icon
        title="Clear Cache"
        class="round mx-2"
        icon="trash"
        variant="danger"
        @click="clearStore"
      ></b-icon>
    </div>
  </div>
</template>

<style scoped>
.round {
  height: 38px;
  width: 38px;
}
.round:nth-child(1):hover {
  color: green;
}
.round:nth-child(2):hover {
  color: yellow;
}
.round:nth-child(3):hover {
  color: yellow;
}
.round:nth-child(5):hover {
  color: red;
}
.topnav {
  background-color: #003367;
  padding: 20px;
}
.round {
  border-radius: 20px;
}
.form-select {
  min-width: 150px;
}
</style>

<script>
export default {
  emits: ["change-language", "save-code"],
  mounted() {
    if (localStorage.getItem("code")) {
      this.$refs.lang.value = localStorage.getItem("lang");
    }
    this.langChange();
  },
  data() {
    return {};
  },
  methods: {
    saveCode() {
      this.$emit("save-code")
    },
    clearStore() {
      localStorage.clear();
      console.log('cache cleared')
    },
    langChange() {
      let language = this.$refs.lang.value;
      this.$emit("change-language", language);
    },
  },
};
</script>