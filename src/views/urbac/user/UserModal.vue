<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  import { userCreate, userUpdate } from '/@/api/urbac/user';
  import { getFormConfig } from '/@/api/urbac/model/userModel';

  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();
      const { success, error } = createMessage;

      const isUpdate = ref(true);
      const userID = ref('');

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm(
        getFormConfig()
      );

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          userID.value = data.record.user_id;
          setFieldsValue({
            ...data.record,
            enable: data.record.enable.toString(),
          });
        } else {
          userID.value = '';
        }

        updateSchema([
          {
            field: 'password',
            ifShow: !unref(isUpdate),
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if (unref(isUpdate)) {
            try {
              const result = await userUpdate.api({ ...values, user_id: unref(userID) });
              if (result == 'ok') {
                success('编辑用户成功');
                closeModal();
                emit('success');
              }
            } catch (e) {
              error('编辑用户失败');
            }
          } else {
            try {
              const result = await userCreate.api(values);
              if (result == 'ok') {
                success('添加用户成功');
                closeModal();
                emit('success');
              }
            } catch (e) {
              error('添加用户失败');
            }
          }
          // emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } catch (error) {
          // console.log(error);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
