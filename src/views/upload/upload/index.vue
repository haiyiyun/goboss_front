<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar></template>
      <template #bodyCell="{ column, text }">
        <template v-if="column.key === 'popover'">
          <Popover placement="top">
            <template #content>
              <pre>{{ text }}</pre>
            </template>
            <div class="popover-text">{{ text }}</div>
          </Popover>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Popover } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getColumns, getFormConfig } from '/@/api/upload/model/uploadModel';
  import { uploadFileListApi } from '/@/api/upload/upload';
  export default defineComponent({
    components: { BasicTable, Popover },
    setup() {
      const [registerTable, { reload }] = useTable({
        title: '文件列表',
        titleHelpMessage: '查看上传文件',
        api: uploadFileListApi,
        columns: getColumns(),
        formConfig: getFormConfig(),
        showIndexColumn: false,
        showTableSetting: true,
        useSearchForm: true,
      });

      function handleReloadCurrent() {
        reload();
      }

      function handleReload() {
        reload({
          page: 1,
        });
      }

      return {
        registerTable,
        handleReloadCurrent,
        handleReload,
      };
    },
  });
</script>
<style lang="less">
  .popover-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
