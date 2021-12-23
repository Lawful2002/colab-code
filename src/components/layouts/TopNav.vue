<template>
  <div class="topnav d-flex align-items-center justify-content-between">
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
    <b-dropdown
      id="dropdown-1"
      text="More Options"
      class="m-2"
      variant="primary"
    >
      <b-dropdown-item disabled>Run Code</b-dropdown-item>
      <b-dropdown-item disabled>Upload from File</b-dropdown-item>
      <b-dropdown-item disabled>Download Code</b-dropdown-item>
      <b-dropdown-item disabled>Collab Mode</b-dropdown-item>
      <b-dropdown-item @click="clearStore">Clear Cache</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<style scoped>
.topnav {
  background-color: #003367;
  padding: 20px;
}
.round {
  border-radius: 20px;
}
.form-select {
  width: 150px;
}
.action-buttons {
  width: 35%;
}
</style>

<script>
export default {
  emits: ["change-language"],
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
    clearStore() {
      localStorage.clear();
    },
    langChange() {
      let language = this.$refs.lang.value;
      this.$emit("change-language", language);
    },
  },
};
</script>