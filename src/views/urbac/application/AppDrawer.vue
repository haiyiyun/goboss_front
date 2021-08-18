<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerAppDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #clearIconSlot="{ model }">
        <a-button preIcon="clarity:remove-line" size="small" @click="clearIconValue(model)" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';

  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formVirtualSchema } from '/@/api/urbac/model/applicationModel';
  import {
    applicationList,
    applicationCreateVirtualApplication,
    applicationUpdate,
  } from '/@/api/urbac/application';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'AppDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();
      const { success, error } = createMessage;

      const isUpdate = ref(true);
      // updateSchema,
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate, clearValidate }] =
        useForm({
          labelWidth: 100,
          schemas: formVirtualSchema,
          showActionButtonGroup: false,
          baseColProps: { lg: 12, md: 24 },
        });

      const [registerAppDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            enable: data.record.enable.toString(),
            meta_title: data.record.meta.title,
            meta_icon: data.record.meta.icon,
            meta_hide_menu: data.record.meta.hide_menu.toString(),
            meta_frame_src: data.record.meta.frame_src,
          });
          updateSchema([
            {
              field: 'level',
              ifShow: true,
            },
            {
              field: 'type',
              ifShow: true,
            },
            {
              field: 'path',
              helpMessage: '',
              componentProps: { disabled: true },
              rules: undefined,
            },
            {
              field: 'parent_path',
              componentProps: { disabled: true },
            },
          ]);
          clearValidate();
        } else {
          updateSchema([
            {
              field: 'level',
              ifShow: false,
            },
            {
              field: 'type',
              ifShow: false,
            },
            {
              field: 'path',
              helpMessage: [
                '最小长度2位字母',
                '头部必须小写字母',
                '尾部必须小写字母或数字',
                '支持小写字母、数字、下划线_、横杠-的组合',
                '输入http开头，将以url形式识别',
              ],
              componentProps: { disabled: false },
              rules: [
                {
                  required: true,
                  message: '请输入Path',
                },
                {
                  validator(_, value) {
                    return new Promise((resolve, reject) => {
                      if (/^http/.test(value) || /^[a-z][a-z0-9_-]{0,}[a-z0-9]$/.test(value)) {
                        resolve();
                      } else {
                        reject(
                          '只支持头部小写字母，尾部小写字母或数字的小写字母、数字、下划线_、横杠-的组合'
                        );
                      }
                    });
                  },
                },
              ],
            },
            {
              field: 'parent_path',
              componentProps: { disabled: false },
            },
          ]);
        }

        const treeData = await applicationList.api({
          page: 1,
          pageSize: 9999,
          exclude_path_is_url: true,
          children_action: 'false',
        });
        updateSchema([
          {
            field: 'parent_path',
            componentProps: { treeData: treeData.items },
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增虚拟应用' : '编辑应用'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          if (unref(isUpdate)) {
            try {
              const result = await applicationUpdate.api({ ...values });
              if (result == 'ok') {
                success('编辑应用成功');
                closeDrawer();
                emit('success');
              }
            } catch (e) {
              error('编辑应用失败');
            }
          } else {
            let path = '';
            let level = '';
            if (values.parent_path == undefined || values.parent_path == '') {
              if (values.path.indexOf('http') == -1) {
                path = '/' + values.path + '/';
              } else {
                path = values.path;
              }

              level = 'app';
            } else {
              let aPath = values.parent_path.split('/');
              if (aPath.length == 3) {
                if (values.path.indexOf('http') == -1) {
                  path = values.path + '/';
                } else {
                  error('只支持上级Path为空时的url设置');
                  return;
                }

                level = 'module';
              } else {
                if (values.path.indexOf('http') == -1) {
                  path = values.path;
                  level = 'action';
                } else {
                  error('只支持上级Path为空时的url设置');
                  return;
                }
              }
            }

            try {
              const result = await applicationCreateVirtualApplication.api({
                ...values,
                path: path,
                level: level,
                type: 'virtual',
              });
              if (result == 'ok') {
                success('添加虚拟应用成功');
                closeDrawer();
                emit('success');
              }
            } catch (e) {
              error('添加虚拟应用失败');
            }
          }
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      function clearIconValue(model) {
        model['meta_icon'] = '';
      }

      return { registerAppDrawer, registerForm, getTitle, handleSubmit, clearIconValue };
    },
  });
</script>
