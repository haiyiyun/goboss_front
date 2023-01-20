<template>
  <div class="p-4">
    <BasicTable @register="registerTable" v-if="hasPermission(roleList.permission)">
      <template #toolbar>
        <a-button v-auth="roleCreate.premission" type="primary" @click="handleCreate">
          新增角色
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑角色',
                onClick: handleEdit.bind(null, record),
                auth: roleUpdate.premission,
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此角色',
                popConfirm: {
                  title: '是否确认物理删除，删除后将无法恢复！',
                  confirm: handleDelete.bind(null, record),
                },
                auth: roleRealDelete.premission,
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getColumns, getSearchFormConfig } from '/@/api/urbac/model/roleModel';
  import { roleList, roleCreate, roleRealDelete, roleUpdate } from '/@/api/urbac/role';
  import { useDrawer } from '/@/components/Drawer';
  import RoleDrawer from './RoleDrawer.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: '/urbac/role/index',
    components: { BasicTable, RoleDrawer, TableAction },
    setup() {
      const { createMessage } = useMessage();
      const { success } = createMessage;
      const { hasPermission } = usePermission();

      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '角色列表',
        titleHelpMessage: '查看角色信息',
        api: roleList.api,
        columns: getColumns(),
        formConfig: getSearchFormConfig(),
        showIndexColumn: false,
        showTableSetting: true,
        useSearchForm: true,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          fixed: undefined,
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleSuccess() {
        reload();
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        const result = await roleRealDelete.api({ _id: record._id });
        if (result == 'ok') {
          success('物理删除成功');
          reload();
        }
      }

      return {
        hasPermission,
        roleList,
        roleRealDelete,
        roleCreate,
        roleUpdate,
        handleSuccess,
        registerDrawer,
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
      };
    },
  });
</script>
