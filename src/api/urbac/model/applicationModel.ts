import { BasicFetchResult } from '/@/api/model/baseModel';
import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { useMessage } from '/@/hooks/web/useMessage';
import { usePermission } from '/@/hooks/web/usePermission';
import { applicationEnable, applicationHide } from '../application';

const { hasPermission } = usePermission();

export interface GetApplicationModel {
  _id: string;
  type: string;
  name: string;
  path: string;
  order: number;
  enable: boolean;
  create_time: string;
  update_time: string;
}

export type ApplicationListGetResultModel = BasicFetchResult<GetApplicationModel>;

export function getSearchFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `name`,
        label: `应用名`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: `path`,
        label: `Path`,
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
      title: '应用名',
      dataIndex: 'name',
      width: 200,
      align: 'left',
    },
    {
      title: 'ID',
      dataIndex: '_id',
      width: 200,
      defaultHidden: true,
      customRender: ({ record }) => {
        if (record?._id) {
          return record._id;
        } else {
          return '';
        }
      },
    },
    {
      title: '显示标题',
      dataIndex: 'meta.title',
      width: 200,
      defaultHidden: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      filters: [
        { text: '逻辑', value: 'code' },
        { text: '虚拟', value: 'virtual' },
      ],
      width: 80,
      customRender: ({ record }) => {
        let text = <string>record.type;
        switch (record.type) {
          case 'code':
            text = '逻辑';
            break;
          case 'virtual':
            text = '虚拟';
            break;
        }

        return text;
      },
      defaultHidden: true,
    },
    {
      title: '图标',
      dataIndex: 'meta.icon',
      width: 50,
      customRender: ({ record }) => {
        if (record.meta != undefined && record.meta.icon) {
          return h(Icon, { icon: record.meta.icon });
        } else {
          return '';
        }
      },
    },
    {
      title: 'Path',
      dataIndex: 'path',
      width: 200,
    },
    {
      title: '绝对路径',
      dataIndex: 'absolute_path',
      width: 250,
      defaultHidden: false,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      width: 100,
      defaultHidden: false,
      customRender: ({ record }) => {
        let text = <string>record.level;
        switch (record.level) {
          case 'app':
            text = '应用';
            break;
          case 'module':
            text = '模块';
            break;
          case 'action':
            text = '方法';
            break;
          case 'method':
            text = 'Method';
            break;
        }

        return text;
      },
    },
    {
      title: 'Order',
      dataIndex: 'order',
      width: 100,
      customRender: ({ record }) => {
        if (record.order != undefined) {
          return record.order;
        } else {
          return '';
        }
      },
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
        if (record.enable != undefined) {
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
              applicationEnable
                .api({ path: record.absolute_path, level: record.level, enable: newEnable })
                .then(() => {
                  record.enable = newEnable;
                  createMessage.success(`已成功修改应用状态`);
                })
                .catch(() => {
                  createMessage.error('修改应用状态失败');
                })
                .finally(() => {
                  record.pendingStatus = false;
                });
            },
            disabled: !hasPermission(applicationEnable.premission),
          });
        } else {
          return '';
        }
      },
    },
    {
      title: '显示',
      dataIndex: 'meta.hide_menu',
      filters: [
        { text: '显示', value: 'false' },
        { text: '隐藏', value: 'true' },
      ],
      width: 100,
      customRender: ({ record }) => {
        if (record.meta != undefined && record.meta.hide_menu != undefined) {
          if (!Reflect.has(record, 'pendingStatus')) {
            record.pendingStatus = false;
          }
          return h(Switch, {
            checked: record.meta.hide_menu === false,
            checkedChildren: '已显示',
            unCheckedChildren: '已隐藏',
            loading: record.pendingStatus,
            onChange(checked: boolean) {
              record.pendingStatus = true;
              const newHide = checked ? false : true;
              const { createMessage } = useMessage();
              applicationHide
                .api({ path: record.absolute_path, level: record.level, hide: newHide })
                .then(() => {
                  record.meta.hide_menu = newHide;
                  createMessage.success(`已成功修改应用状态`);
                })
                .catch(() => {
                  createMessage.error('修改应用状态失败');
                })
                .finally(() => {
                  record.pendingStatus = false;
                });
            },
            disabled: !hasPermission(applicationHide.premission),
          });
        } else {
          return '';
        }
      },
    },
    {
      title: '创建时间',
      width: 150,
      dataIndex: 'create_time',
      customRender: ({ record }) => {
        if (record.create_time != undefined) {
          return formatToDateTime(record.create_time);
        } else {
          return '';
        }
      },
    },
    {
      title: '更新时间',
      width: 150,
      dataIndex: 'update_time',
      customRender: ({ record }) => {
        if (record.update_time != undefined) {
          return formatToDateTime(record.create_time);
        } else {
          return '';
        }
      },
      defaultHidden: true,
    },
  ];
}

export function getCreateCodeFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 120,
    showActionButtonGroup: false,
    autoFocusFirstItem: true,
    schemas: [
      {
        field: 'name',
        label: '应用名称',
        required: true,
        component: 'Input',
        componentProps: {
          placeholder: '逻辑应用名称',
        },
      },
      {
        field: 'path',
        label: '应用注册路径',
        component: 'Input',
        componentProps: {
          placeholder: '逻辑应用注册路径,例如:user',
          addonBefore: '/',
          addonAfter: '/',
        },
        helpMessage: [
          '最小长度2位字母',
          '头部必须小写字母',
          '尾部必须小写字母或数字',
          '支持小写字母、数字、下划线_、横杠-的组合',
        ],
        rules: [
          {
            required: true,
            message: '请输入应用注册路径',
          },
          {
            validator(_, value) {
              return new Promise((resolve, reject) => {
                if (/^[a-z][a-z0-9_-]{0,}[a-z0-9]$/.test(value)) {
                  resolve();
                } else {
                  reject(
                    '只支持头部小写字母，尾部小写字母或数字的小写字母、数字、下划线_、横杠-的组合',
                  );
                }
              });
            },
          },
        ],
      },
    ],
  };
}

export const formVirtualSchema: FormSchema[] = [
  {
    field: 'level',
    label: 'Level',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '应用', value: 'app' },
        { label: '模块', value: 'module' },
        { label: '方法', value: 'action' },
        { label: 'Method', value: 'method' },
      ],
      disabled: true,
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'type',
    label: '类型',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '逻辑', value: 'code' },
        { label: '虚拟', value: 'virtual' },
      ],
      disabled: true,
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'meta_title',
    label: '显示标题',
    component: 'Input',
    required: true,
  },
  {
    field: 'path',
    label: 'Path',
    defaultValue: '',
    component: 'Input',
    helpMessage: [
      '最小长度2位字母',
      '头部必须小写字母',
      '尾部必须小写字母或数字',
      '支持小写字母、数字、下划线_、横杠-的组合',
      '输入http开头，将以url形式识别',
    ],
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
                '只支持头部小写字母，尾部小写字母或数字的小写字母、数字、下划线_、横杠-的组合',
              );
            }
          });
        },
      },
    ],
  },
  {
    field: 'parent_path',
    label: '上级Path',
    component: 'TreeSelect',
    defaultValue: '',
    componentProps: {
      fieldNames: {
        label: 'name',
        key: 'absolute_path',
        value: 'absolute_path',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'meta_icon',
    label: '图标',
    component: 'IconPicker',
    componentProps: {
      copy: false,
    },
  },
  {
    field: 'clear_icon',
    label: '清除图标',
    component: 'Input',
    slot: 'clearIconSlot',
  },
  {
    field: 'order',
    label: '排序',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'enable',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 'false',
    required: true,
    componentProps: {
      options: [
        { label: '启用', value: 'true' },
        { label: '禁用', value: 'false' },
      ],
    },
  },
  {
    field: 'meta_hide_menu',
    label: '是否显示',
    component: 'RadioButtonGroup',
    defaultValue: 'true',
    required: true,
    componentProps: {
      options: [
        { label: '是', value: 'false' },
        { label: '否', value: 'true' },
      ],
    },
  },
  {
    field: 'meta_frame_src',
    label: '内嵌地址',
    component: 'Input',
    defaultValue: '',
    ifShow: ({ values }) => {
      if (values.type == 'code' || values.path.indexOf('http') > -1) {
        return false;
      } else {
        return true;
      }
    },
  },
];
