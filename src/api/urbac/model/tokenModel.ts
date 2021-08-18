import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';

export interface GetTokenSignInfoModel {
  ip: string;
  user_agent: string;
}

export interface GetTokenModel {
  _id: string;
  user_id: string;
  user_name: string;
  token_type: string;
  token: string;
  sign_info: GetTokenSignInfoModel;
  expired_time: string;
  create_time: string;
  update_time: string;
}

export interface TokenIDParams {
  _id: string;
  token: string;
}

/**
 * @description: Request list interface parameters
 */
export type TokenParams = BasicPageParams;

/**
 * @description: Request list return value
 */
export type TokenListGetResultModel = BasicFetchResult<GetTokenModel>;

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
        field: `user_name`,
        label: `用户名`,
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
      title: '用户ID',
      dataIndex: 'user_id',
      width: 200,
    },
    {
      title: '用户名',
      dataIndex: 'user_name',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'token_type',
      filters: [
        { text: '自登', value: 'self' },
        { text: '认证', value: 'auth' },
        { text: '伪装', value: 'guise' },
      ],
      width: 80,
    },
    {
      title: 'IP',
      dataIndex: 'sign_info.ip',
      width: 100,
    },
    {
      title: 'UserAgent',
      dataIndex: 'sign_info.user_agent',
      width: 100,
      slots: { customRender: 'popover' },
    },
    {
      title: '过期时间',
      width: 150,
      dataIndex: 'expired_time',
      customRender: ({ text }) => formatToDateTime(text),
    },
    {
      title: '创建时间',
      width: 150,
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
