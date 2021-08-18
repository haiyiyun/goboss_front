import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { usePermission } from '/@/hooks/web/usePermission';
import { userEnable, userDelete } from '../user';

const { hasPermission } = usePermission();

export interface GetUserModel {
  _id: string;
  name: string;
  real_name: string;
  email: string;
  avatar: string;
  enable: boolean;
  delete: number;
  create_time: string;
  update_time: string;
}

/**
 * @description: Request list interface parameters
 */
export type UserParams = BasicPageParams;

/**
 * @description: Request list return value
 */
export type UserListGetResultModel = BasicFetchResult<GetUserModel>;

export function getSearchFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    showActionButtonGroup: true,
    actionColOptions: {
      span: 23,
    },
    schemas: [
      {
        field: `_id`,
        label: `用户ID`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: `name`,
        label: `用户名`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: `real_name`,
        label: `真实姓名`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: `email`,
        label: `邮箱`,
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
      title: '用户ID',
      dataIndex: 'user_id',
      width: 200,
      defaultHidden: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 100,
    },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
      width: 100,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 100,
      slots: { customRender: 'avatar' },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 120,
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
            userEnable
              .api({ user_id: record.user_id, enable: newEnable })
              .then(() => {
                record.enable = newEnable;
                createMessage.success(`已成功修改用户状态`);
              })
              .catch(() => {
                createMessage.error('修改用户状态失败');
              })
              .finally(() => {
                record.pendingStatus = false;
              });
          },
          disabled: !hasPermission(userEnable.premission),
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
            userDelete
              .api({ user_id: record.user_id, delete: newDelete })
              .then(() => {
                record.delete = newDelete;
                if (newDelete) {
                  createMessage.success(`已成功删除用户`);
                } else {
                  createMessage.success(`已成功恢复用户`);
                }
              })
              .catch(() => {
                createMessage.error('删除角色失败');
              })
              .finally(() => {
                record.pendingStatus = false;
              });
          },
          disabled: !hasPermission(userDelete.premission),
        });
      },
    },
    {
      title: '描述',
      width: 200,
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      width: 150,
      // sorter: true,
      dataIndex: 'create_time',
      customRender: ({ text }) => formatToDateTime(text),
    },
    {
      title: '更新时间',
      width: 150,
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
        field: 'username',
        label: '用户名',
        component: 'Input',
        required: true,
      },
      {
        field: 'real_name',
        label: '真实姓名',
        component: 'Input',
        required: true,
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
        field: 'password',
        label: '密码',
        component: 'InputPassword',
        required: true,
        ifShow: false,
      },
      {
        label: '邮箱',
        field: 'email',
        component: 'Input',
        required: true,
      },
      {
        label: '描述',
        field: 'description',
        component: 'InputTextArea',
      },
    ],
  };
}
