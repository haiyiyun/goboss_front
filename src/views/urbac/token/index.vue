<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar></template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'popoverSIUA'">
          <Popover placement="top">
            <template #content>
              <pre>{{ record.sign_info.user_agent }}</pre>
            </template>
            <div class="popover-text">{{ record.sign_info.user_agent }}</div>
          </Popover>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            v-if="record.token != token"
            stopButtonPropagation
            :actions="[
              {
                label: '踢出',
                icon: 'ic:outline-delete-outline',
                popConfirm: {
                  title: '是否踢出？',
                  confirm: handleDelete.bind(null, record),
                },
                auth: tokenDelete.premission,
              },
            ]"
          />
          <Tag v-else color="green">当前用户</Tag>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { Popover, Tag } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getColumns, getFormConfig } from '/@/api/urbac/model/tokenModel';
  import { tokenListApi, tokenDelete } from '/@/api/urbac/token';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: '/urbac/token/index',
    components: { BasicTable, Popover, TableAction, Tag },
    setup() {
      const { createMessage } = useMessage();

      const { success } = createMessage;

      const userStore = useUserStore();

      const token = computed(() => {
        return userStore.getToken || '';
      });

      const [registerTable, { reload }] = useTable({
        title: '在线列表',
        titleHelpMessage: '查看用户在线信息',
        api: tokenListApi,
        columns: getColumns(),
        formConfig: getFormConfig(),
        showIndexColumn: false,
        showTableSetting: true,
        useSearchForm: true,
        actionColumn: {
          width: 160,
          title: '操作',
          key: 'action',
        },
      });

      async function handleDelete(record: Recordable) {
        const result = await tokenDelete.api({ _id: record._id, token: record.token });
        if (result == 'ok') {
          success('踢出成功');
          reload();
        }
      }

      return {
        tokenDelete,
        token,
        registerTable,
        handleDelete,
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
