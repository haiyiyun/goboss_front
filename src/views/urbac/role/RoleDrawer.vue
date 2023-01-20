<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #scopeSlot="{ model, field }">
        <Select
          v-model:value="model[field]"
          :options="scopeSelectOptions"
          :allowClear="false"
          :style="{ width: '80px' }"
          @change="scopeChange"
        />
      </template>

      <template #applicationsSlot="{ model, field }">
        <BasicTree
          v-if="hasPermission(applicationRouteList.permission)"
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'absolute_path' }"
          :checkable="true"
          :checkStrictly="false"
          :autoExpandParent="true"
          ref="treeRef"
          title="分配应用权限"
          :style="{ width: '300px' }"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { getFormConfig } from '/@/api/urbac/model/roleModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { Select } from 'ant-design-vue';
  import { roleCreate, roleUpdate } from '/@/api/urbac/role';
  import { applicationRouteList } from '/@/api/urbac/application';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree, Select },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage();
      const { success, error } = createMessage;
      const { hasPermission } = usePermission();

      const treeRef = ref<Nullable<TreeActionType>>(null);
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);

      const scopeSelectOptions = [
        { label: '方法', value: '0' },
        { label: '模块', value: '1' },
        { label: '应用', value: '2' },
        { label: '平台', value: '3' },
      ];

      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm(
        getFormConfig(),
      );

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        updateSchema({ field: 'name', componentProps: { disabled: false } });
        setDrawerProps({ confirmLoading: false });
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (hasPermission(applicationRouteList.premission) && unref(treeData).length === 0) {
          treeData.value = (await applicationRouteList.api()) as any as TreeItem[];
        }
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          let appArr = transformArrayApps(data.record.right.applications);
          setFieldsValue({
            name: data.record.name,
            scope: data.record.right.scope.toString(),
            enable: data.record.enable.toString(),
            users: data.record.users ? data.record.users : [],
            applications: appArr,
          });

          updateSchema({ field: 'name', componentProps: { disabled: true } });
          scopeExpand(data.record.right.scope);
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      function scopeExpand(scope: number) {
        switch (scope) {
          case 0:
            getTree().expandAll(true);
            break;
          case 1:
            getTree().filterByLevel(1);
            break;
          case 2:
            getTree().expandAll(false);
            break;
          case 3:
            getTree().expandAll(false);
            break;
        }
      }

      function transformArrayApps(apps: any) {
        let arrayApps: string[] = [];
        if (apps) {
          for (let aPath in apps) {
            let aVal = apps[aPath];
            if (aVal.modules && Object.keys(aVal.modules).length > 0) {
              for (let mKey in aVal.modules) {
                let mVal = aVal.modules[mKey];
                if (mVal.actions && Object.keys(mVal.actions).length > 0) {
                  for (let actKey in mVal.actions) {
                    let actVal = mVal.actions[actKey];
                    if (actVal.method && actVal.method.length > 0) {
                      for (let methodKey in actVal.method) {
                        arrayApps.push(
                          actVal.method[methodKey] + '_' + aVal.path + mVal.path + actVal.path,
                        );
                      }
                    } else {
                      arrayApps.push(aVal.path + mVal.path + actVal.path);
                    }
                  }
                } else {
                  arrayApps.push(aVal.path + mVal.path);
                }
              }
            } else {
              arrayApps.push(aVal.path);
            }
          }
        }

        return arrayApps;
      }

      function transformObjectApps(scope: number, apps: string[] | any): object {
        let mapApps: object = {};
        apps.forEach((path) => {
          let aPath: string[] = [];
          let httpPos = path.indexOf('http');
          if (httpPos == -1) {
            aPath = path.split('/');
          } else if (httpPos == 0) {
            mapApps[path] = {
              path: path,
            };
          } else {
            let pathTmp = path.slice(0, httpPos - 1);
            let urlTmp = path.slice(httpPos);
            aPath = pathTmp.split('/');
            aPath.push(urlTmp);
          }

          //应用
          if (scope < 3) {
            if (aPath.length > 1) {
              let appPath = '/' + aPath[1] + '/';
              if (!mapApps[appPath]) {
                mapApps[appPath] = {
                  path: appPath,
                };
              }

              //模块
              if (scope < 2) {
                if (aPath.length > 2) {
                  if (aPath[2] != '') {
                    let modulePath = aPath[2];
                    if (modulePath.indexOf('http') == -1) {
                      modulePath = modulePath + '/';
                    }

                    if (!mapApps[appPath].modules) {
                      mapApps[appPath].modules = {};
                    }

                    if (!mapApps[appPath].modules[modulePath]) {
                      mapApps[appPath].modules[modulePath] = {
                        path: modulePath,
                      };
                    }

                    //方法
                    if (scope < 1) {
                      if (aPath.length > 3) {
                        let actionPath = aPath[3];

                        if (actionPath != '') {
                          if (!mapApps[appPath].modules[modulePath].actions) {
                            mapApps[appPath].modules[modulePath].actions = {};
                          }

                          if (!mapApps[appPath].modules[modulePath].actions[actionPath]) {
                            mapApps[appPath].modules[modulePath].actions[actionPath] = {
                              path: actionPath,
                            };
                          }

                          //METHOD
                          if (aPath[0] != '' && aPath[0].indexOf('_') != -1) {
                            let pos = aPath[0].indexOf('_');
                            let method = aPath[0].slice(0, pos);
                            if (!mapApps[appPath].modules[modulePath].actions[actionPath].method) {
                              mapApps[appPath].modules[modulePath].actions[actionPath].method = [];
                            }

                            if (
                              mapApps[appPath].modules[modulePath].actions[
                                actionPath
                              ].method.indexOf(method) == -1
                            ) {
                              mapApps[appPath].modules[modulePath].actions[actionPath].method.push(
                                method,
                              );
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });

        //二次整理，根据sopce剔除
        if (mapApps) {
          //平台
          if (scope == 3) {
            mapApps = {};
          } else {
            for (let aPath in mapApps) {
              //方法不做处理
              // if (scope == 0) {
              // }

              //模块
              if (scope == 1) {
                if (mapApps[aPath]['modules']) {
                  for (let mPath in mapApps[aPath]['modules']) {
                    if (mapApps[aPath]['modules'][mPath]['actions']) {
                      delete mapApps[aPath]['modules'][mPath]['actions'];
                    }
                  }
                }
              }

              //应用
              if (scope == 2) {
                if (mapApps[aPath]['modules']) {
                  delete mapApps[aPath]['modules'];
                }
              }
            }
          }
        }

        return mapApps;
      }

      function scopeChange(scope: number) {
        scope = Number(scope);
        scopeExpand(scope);
      }

      async function handleSubmit() {
        try {
          const values = await validate();
          let mapApp = transformObjectApps(
            values.scope,
            values?.applications?.checked
              ? values.applications.checked
              : values?.applications
              ? values?.applications
              : [],
          );
          let apiData = {
            name: values.name,
            scope: values.scope,
            enable: values.enable,
            users: values.users,
            applications: JSON.stringify(mapApp),
          };
          setDrawerProps({ confirmLoading: true });
          if (unref(isUpdate)) {
            try {
              const result = await roleUpdate.api(apiData);
              if (result == 'ok') {
                closeDrawer();
                success('编辑角色成功');
                emit('success');
              }
            } catch (e) {
              error('编辑角色失败');
              closeDrawer();
            }
          } else {
            try {
              const result = await roleCreate.api(apiData);
              if (result == 'ok') {
                success('添加角色成功');
                closeDrawer();
                emit('success');
              }
            } catch (e) {
              error('添加角色失败');
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        scopeChange,
        scopeSelectOptions,
        scopeExpand,
        treeRef,
        applicationRouteList,
        hasPermission,
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
      };
    },
  });
</script>
