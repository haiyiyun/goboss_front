<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar></template>
      <template #popover="{ text }">
        <Popover placement="top">
          <template #content>
            <pre>{{ text }}</pre>
          </template>
          <div class="popover-text">{{ text }}</div>
        </Popover>
      </template>
      <template #popoverJSON="{ text }">
        <Popover v-if="text" placement="right">
          <template #content>
            <div class="popover-box">
              <pre>{{ JSON.stringify(text, null, 2) }}</pre>
            </div>
          </template>
          <Icon icon="akar-icons:eye" />
        </Popover>
        <span v-else>无</span>
      </template>
      <template #popoverJSONTEXT="{ text }">
        <Popover v-if="text" placement="right">
          <template #content>
            <div class="popover-box">
              <pre>{{ fmtBody(text) }}</pre>
            </div>
          </template>
          <Icon icon="akar-icons:eye" />
        </Popover>
        <span v-else>无</span>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { Popover } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getColumns, getFormConfig } from '/@/api/log/model/logModel';
  import { logListApi } from '/@/api/log/log';
  export default defineComponent({
    components: { BasicTable, Popover, Icon },
    setup() {
      const [registerTable] = useTable({
        title: '日志列表',
        titleHelpMessage: '查看系统日志',
        api: logListApi,
        columns: getColumns(),
        formConfig: getFormConfig(),
        showIndexColumn: false,
        showTableSetting: true,
        useSearchForm: true,
      });

      function fmtBody(value) {
        try {
          return JSON.parse(value);
        } catch (err) {
          return value;
        }
      }
      return {
        registerTable,
        fmtBody,
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

  .popover-box {
    background: #112435;
    color: #f08047;
    height: 600px;
    width: 420px;
    overflow: auto;
  }

  .popover-box::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
</style>
