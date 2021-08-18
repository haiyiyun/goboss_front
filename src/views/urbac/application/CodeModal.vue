<template>
  <BasicModal v-bind="$attrs" @register="registerCodeModal" title="创建逻辑应用" @ok="handleSubmit">
    <BasicForm @register="registerCreateCodeForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { applicationCreateCodeApplication } from '/@/api/urbac/application';
  import { getCreateCodeFormConfig } from '/@/api/urbac/model/applicationModel';

  export default defineComponent({
    name: 'CodeModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();
      const { success, error } = createMessage;

      const [registerCreateCodeForm, { resetFields, validate }] = useForm(
        getCreateCodeFormConfig()
      );

      const [registerCodeModal, { setModalProps, closeModal }] = useModalInner(async () => {
        resetFields();
        setModalProps({ confirmLoading: false });
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          values.path = '/' + values.path + '/';
          setModalProps({ confirmLoading: true });

          try {
            const result = await applicationCreateCodeApplication.api(values);
            if (result == 'ok') {
              success('添加应用成功');
              closeModal();
              emit('success');
            }
          } catch (e) {
            error('添加应用失败');
          }
        } catch (error) {
          // console.log(error);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        registerCodeModal,
        registerCreateCodeForm,
        handleSubmit,
      };
    },
  });
</script>
