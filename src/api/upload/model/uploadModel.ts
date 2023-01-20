import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';

export interface GetUploadFileModel {
  _id: string;
  type: string;
  storage: string;
  user_id: string;
  content_type: string;
  original_file_name: string;
  file_name: string;
  file_ext: string;
  path: string;
  url: string;
  size: string;
  create_time: string;
  update_time: string;
}

/**
 * @description: Request list interface parameters
 */
export type UploadFileParams = BasicPageParams;

/**
 * @description: Request list return value
 */
export type UploadFileListGetResultModel = BasicFetchResult<GetUploadFileModel>;

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
          xl: 8,
          xxl: 4,
        },
      },
      {
        field: `content_type`,
        label: `ContentType`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 8,
          xxl: 4,
        },
      },
      {
        field: `original_file_name`,
        label: `原始文件名`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 8,
          xxl: 4,
        },
      },
      {
        field: `file_name`,
        label: `文件名`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 8,
          xxl: 4,
        },
      },
      {
        field: `file_ext`,
        label: `文件后缀`,
        component: 'Input',
        colProps: {
          md: 12,
          xl: 8,
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
      fixed: 'left',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      filters: [
        { text: '图片', value: 'image' },
        { text: '媒体', value: 'media' },
        { text: '文档', value: 'document' },
        { text: '压缩包', value: 'compression' },
        { text: '文件', value: 'file' },
      ],
    },
    {
      title: '存储',
      dataIndex: 'storage',
      width: 80,
      filters: [{ text: '本地', value: 'local' }],
    },
    {
      title: 'ContentType',
      dataIndex: 'content_type',
      key: 'popover',
      width: 100,
    },
    {
      title: '原始文件名',
      dataIndex: 'original_file_name',
      key: 'popover',
      width: 100,
    },
    {
      title: '文件名',
      dataIndex: 'file_name',
      key: 'popover',
      width: 100,
    },
    {
      title: '文件后缀',
      dataIndex: 'file_ext',
      width: 100,
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'popover',
      width: 100,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'popover',
      width: 100,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      width: 100,
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
