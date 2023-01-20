<template>
  <div class="p-4">
    <BasicTable @register="registerTable" v-if="hasPermission(applicationList.permission)">
      <template #toolbar>
        <a-button
          v-auth="applicationCreateCodeApplication.premission"
          danger
          type="primary"
          @click="handleCreateCode"
        >
          新增逻辑应用
        </a-button>
        <a-button
          v-auth="applicationCreateVirtualApplication.premission"
          @click="handleCreateVirtual"
        >
          新增虚拟应用
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'mdi:database-refresh',
                color: 'error',
                tooltip: '重新读取应用信息',
                popConfirm: {
                  title: '是否确认重新读取，重新读取将影响此应用的使用！',
                  confirm: handleReadCodeApplication.bind(null, record),
                },
                auth: handleReadCodeApplication.premission,
                ifShow: () => {
                  return record.type == 'code' && record.level == 'app';
                },
              },
              {
                icon: 'clarity:note-edit-line',
                color: record.type == 'code' ? 'error' : 'warning',
                tooltip: '编辑应用',
                onClick: handleEditVirtual.bind(null, record),
                ifShow: () => {
                  return record.level != 'method';
                },
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此应用',
                popConfirm: {
                  title: '是否确认删除，删除后将影响此应用的使用！',
                  confirm: handleDelete.bind(null, record),
                },
                auth: applicationDelete.premission,
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <CodeModal @register="registerCodeModal" @success="handleCodeSuccess" />
    <AppDrawer @register="registerAppDrawer" @success="handleVirtualSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';

  import { useModal } from '/@/components/Modal';
  import CodeModal from './CodeModal.vue';
  import { useDrawer } from '/@/components/Drawer';
  import AppDrawer from './AppDrawer.vue';

  import { getColumns, getSearchFormConfig } from '/@/api/urbac/model/applicationModel';

  import {
    applicationList,
    applicationCreateVirtualApplication,
    applicationCreateCodeApplication,
    applicationDelete,
    applicationReadCodeApplication,
  } from '/@/api/urbac/application';

  export default defineComponent({
    name: '/urbac/application/index',
    components: { BasicTable, CodeModal, TableAction, AppDrawer },
    setup() {
      const { hasPermission } = usePermission();
      const { createMessage } = useMessage();
      const { success, error } = createMessage;

      const [registerCodeModal, { openModal: openCreateCodeModal }] = useModal();
      const [registerAppDrawer, { openDrawer: openVirtualDrawer }] = useDrawer();

      const [registerTable, { reload }] = useTable({
        title: '应用列表',
        titleHelpMessage: '查看应用信息',
        api: applicationList.api,
        columns: getColumns(),
        formConfig: getSearchFormConfig(),
        isTreeTable: true,
        pagination: false,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          fixed: undefined,
        },
      });

      function handleCreateCode() {
        openCreateCodeModal(true, {
          isUpdate: false,
        });
      }

      function handleCodeSuccess() {
        reload();
      }

      function handleVirtualSuccess() {
        reload();
      }

      function handleCreateVirtual() {
        openVirtualDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEditVirtual(record: Recordable) {
        openVirtualDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        try {
          const result = await applicationDelete.api({
            path: record.absolute_path,
            level: record.level,
          });
          if (result == 'ok') {
            success('删除应用成功');
            reload();
          }
        } catch (e) {
          error('删除应用失败');
        }
      }

      async function handleReadCodeApplication(record: Recordable) {
        try {
          const result = await applicationReadCodeApplication.api({
            name: record.name,
            path: record.path,
          });
          if (result == 'ok') {
            success('读取应用成功');
            reload();
          }
        } catch (e) {
          error('读取应用失败');
        }
      }

      return {
        hasPermission,
        applicationList,
        applicationCreateVirtualApplication,
        applicationCreateCodeApplication,
        applicationDelete,
        registerCodeModal,
        registerAppDrawer,
        registerTable,
        handleCreateCode,
        handleEditVirtual,
        handleCodeSuccess,
        handleVirtualSuccess,
        handleCreateVirtual,
        handleDelete,
        handleReadCodeApplication,
      };
    },
  });
</script>
