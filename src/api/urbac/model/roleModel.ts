import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { roleEnable, roleDelete } from '../role';
import { userList } from '../user';
import { usePermission } from '/@/hooks/web/usePermission';

const { hasPermission } = usePermission();

export interface GetRoleModel {
  _id: string;
  name: string;
  users?: string[];
  right: any;
  enable: boolean;
  delete: boolean;
  create_time: string;
  update_time: string;
}

/**
 * @description: Request list interface parameters
 */
export type RoleParams = BasicPageParams;

/**
 * @description: Request list return value
 */
export type RoleListGetResultModel = BasicFetchResult<GetRoleModel>;

export function getSearchFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `name`,
        label: `角色名`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: `user_id`,
        label: `用户ID`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 6,
          xxl: 4,
        },
      },
    ],
  };
}

export function getColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: '_id',
      width: 100,
      defaultHidden: true,
    },
    {
      title: '角色名',
      dataIndex: 'name',
      width: 80,
    },
    {
      title: '权限作用域',
      dataIndex: 'right.scope',
      width: 80,
      filters: [
        { text: '方法', value: '0' },
        { text: '模块', value: '1' },
        { text: '应用', value: '2' },
        { text: '平台', value: '3' },
      ],
      customRender: ({ record }) => {
        let text = <string>record.right.scope;
        switch (record.right.scope) {
          case 0:
            text = '方法';
            break;
          case 1:
            text = '模块';
            break;
          case 2:
            text = '应用';
            break;
          case 3:
            text = '平台';
            break;
        }

        return text;
      },
    },
    {
      title: '分配用户数',
      dataIndex: 'users',
      width: 80,
      customRender: ({ record }) => (record.users ? record.users.length : 0),
    },
    {
      title: '状态',
      dataIndex: 'enable',
      filters: [
        { text: '正常', value: 'true' },
        { text: '禁用', value: 'false' },
      ],
      width: 100,
      customRender: ({ record }) => {
        if (!Reflect.has(record, 'pendingStatus')) {
          record.pendingStatus = false;
        }
        return h(Switch, {
          checked: record.enable === true,
          checkedChildren: '已启用',
          unCheckedChildren: '已禁用',
          loading: record.pendingStatus,
          onChange(checked: boolean) {
            record.pendingStatus = true;
            const newEnable = checked ? true : false;
            const { createMessage } = useMessage();
            roleEnable
              .api({ _id: record._id, enable: newEnable })
              .then(() => {
                record.enable = newEnable;
                createMessage.success(`已成功修改角色状态`);
              })
              .catch(() => {
                createMessage.error('修改角色状态失败');
              })
              .finally(() => {
                record.pendingStatus = false;
              });
          },
          disabled: !hasPermission(roleEnable.premission),
        });
      },
    },
    {
      title: '是否删除',
      dataIndex: 'delete',
      filters: [
        { text: '正常', value: 'false' },
        { text: '删除', value: 'true' },
      ],
      width: 100,
      customRender: ({ record }) => {
        if (!Reflect.has(record, 'pendingStatus')) {
          record.pendingStatus = false;
        }
        return h(Switch, {
          checked: record.delete === false,
          checkedChildren: '正常',
          unCheckedChildren: '已删除',
          loading: record.pendingStatus,
          onChange(checked: boolean) {
            record.pendingStatus = true;
            const newDelete = checked ? false : true;
            const { createMessage } = useMessage();
            roleDelete
              .api({ _id: record._id, delete: newDelete })
              .then(() => {
                record.delete = newDelete;
                if (newDelete) {
                  createMessage.success(`已成功删除角色`);
                } else {
                  createMessage.success(`已成功恢复角色`);
                }
              })
              .catch(() => {
                createMessage.error('删除角色失败');
              })
              .finally(() => {
                record.pendingStatus = false;
              });
          },
          disabled: !hasPermission(roleDelete.premission),
        });
      },
    },
    {
      title: '创建时间',
      width: 150,
      sorter: true,
      dataIndex: 'create_time',
      customRender: ({ text }) => formatToDateTime(text),
      defaultHidden: true,
    },
    {
      title: '更新时间',
      width: 150,
      sorter: true,
      dataIndex: 'update_time',
      customRender: ({ text }) => formatToDateTime(text),
      defaultHidden: true,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 90,
    showActionButtonGroup: false,
    schemas: [
      {
        field: 'name',
        label: '角色名称',
        required: true,
        component: 'Input',
      },
      {
        field: 'scope',
        label: '作用域',
        required: true,
        component: 'Input',
        slot: 'scopeSlot',
      },
      {
        field: 'enable',
        label: '状态',
        required: true,
        component: 'RadioButtonGroup',
        defaultValue: 'false',
        componentProps: {
          options: [
            { label: '启用', value: 'true' },
            { label: '停用', value: 'false' },
          ],
        },
      },
      {
        field: 'users',
        label: '角色成员',
        helpMessage: ['选择角色成员', '支持搜索用户名'],
        required: false,
        ifShow: hasPermission(userList.premission),
        component: 'ApiSelect',
        componentProps: {
          api: userList.api,
          params: {
            page: 1,
            pageSize: 9999,
            'enable[]': true,
            'delete[]': false,
          },
          mode: 'multiple',
          resultField: 'items',
          labelField: 'username',
          valueField: 'user_id',
          immediate: true,
          showSearch: true,
          optionFilterProp: 'label',
          allowClear: false,
        },
      },
      {
        label: ' ',
        field: 'applications',
        slot: 'applicationsSlot',
        component: 'Input',
        show: ({ values }) => {
          return values.scope != 3;
        },
      },
    ],
  };
}
