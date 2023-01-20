import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';

export interface GetLogModel {
  _id: string;
  type: string;
  user_id: string;
  user: string;
  ip: string;
  method: string;
  path: string;
  query: string;
  referer: string;
  request_header: string;
  request_payload: string;
  response_header: string;
  response_data: string;
  delete_time: string;
  create_time: string;
  update_time: string;
}

/**
 * @description: Request list interface parameters
 */
export type LogParams = BasicPageParams;

/**
 * @description: Request list return value
 */
export type LogListGetResultModel = BasicFetchResult<GetLogModel>;

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
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
      {
        field: `user`,
        label: `用户`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: `ip`,
        label: `IP`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 6,
          xxl: 4,
        },
      },
      {
        field: `path`,
        label: `请求地址`,
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
      width: 200,
      defaultHidden: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      fixed: 'left',
      width: 80,
      filters: [
        { text: '登录', value: 'login' },
        { text: '认证', value: 'auth' },
        { text: '操作', value: 'operate' },
      ],
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      fixed: 'left',
      width: 200,
    },
    {
      title: '用户',
      dataIndex: 'user',
      fixed: 'left',
      width: 80,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      width: 100,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      filters: [
        { text: 'GET', value: 'GET' },
        { text: 'POST', value: 'POST' },
      ],
      width: 100,
    },
    {
      title: '请求地址',
      dataIndex: 'path',
      key: 'popover',
      width: 100,
    },
    {
      title: 'Query',
      dataIndex: 'query',
    },
    {
      title: 'Referer',
      dataIndex: 'referer',
    },
    {
      title: '请求头',
      dataIndex: 'request_header',
      key: 'popoverJSON',
      width: 80,
    },
    {
      title: '请求体',
      dataIndex: 'request_payload',
      key: 'popoverJSON',
      width: 80,
    },
    {
      title: '回复头',
      dataIndex: 'response_header',
      key: 'popoverJSON',
      width: 80,
    },
    {
      title: '回复体',
      dataIndex: 'response_data',
      key: 'popoverJSONTEXT',
      width: 80,
    },
    {
      title: '删除时间',
      width: 150,
      sorter: true,
      dataIndex: 'delete_time',
      customRender: ({ text }) => formatToDateTime(text),
      defaultHidden: true,
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
