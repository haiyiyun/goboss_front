<template>
  <div class="p-4">
    <BasicTable @register="registerTable" v-if="hasPermission(userList.permission)">
      <template #toolbar>
        <a-button v-auth="userCreate.premission" type="primary" @click="handleCreate"
          >新增用户</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <Avatar v-if="record.avatar" :size="60" :src="record.avatar" />
          <span v-else>无</span>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑用户',
                onClick: handleEdit.bind(null, record),
                auth: userUpdate.premission,
              },
              {
                icon: 'carbon:password',
                tooltip: '重置密码',
                popConfirm: {
                  title: '是否确认要重置此用户密码？',
                  confirm: handleResetPassword.bind(null, record),
                },
                auth: userResetPassword.premission,
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此用户',
                popConfirm: {
                  title: '是否确认物理删除，删除后将无法恢复！',
                  confirm: handleDelete.bind(null, record),
                },
                auth: userRealDelete.premission,
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <UserModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useModal } from '/@/components/Modal';
  import UserModal from './UserModal.vue';

  import { getColumns, getSearchFormConfig } from '/@/api/urbac/model/userModel';
  import {
    userList,
    userCreate,
    userRealDelete,
    userUpdate,
    userResetPassword,
  } from '/@/api/urbac/user';
  export default defineComponent({
    name: '/urbac/user/index',
    components: { BasicTable, Avatar, UserModal, TableAction },
    setup() {
      const { hasPermission } = usePermission();
      const { createMessage, createSuccessModal } = useMessage();
      const { success, error } = createMessage;

      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '用户列表',
        titleHelpMessage: '查看用户信息',
        api: userList.api,
        columns: getColumns(),
        formConfig: getSearchFormConfig(),
        showIndexColumn: false,
        showTableSetting: true,
        useSearchForm: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          key: 'action',
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleResetPassword(record: Recordable) {
        try {
          const result = await userResetPassword.api({ user_id: record.user_id });
          if (result) {
            createSuccessModal({ title: '重置密码成功,请保存以下密码：', content: result });
          }
        } catch (e) {
          error('重置密码失败');
        }
      }

      async function handleDelete(record: Recordable) {
        try {
          const result = await userRealDelete.api({ user_id: record.user_id });
          if (result == 'ok') {
            success('物理删除成功');
            reload();
          }
        } catch (e) {
          error('物理删除失败');
        }
      }

      function handleSuccess() {
        reload();
      }

      return {
        hasPermission,
        userList,
        userCreate,
        userUpdate,
        userRealDelete,
        userResetPassword,
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleResetPassword,
      };
    },
  });
</script>
