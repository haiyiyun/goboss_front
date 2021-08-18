import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams, UploadFileListGetResultModel } from './model/uploadModel';

enum Api {
  UPLOAD_FILE_LIST = '/upload/upload/index',
}

/**
 * @description: Get sample list value
 */

export const uploadFileListApi = (params: UploadFileParams) =>
  defHttp.get<UploadFileListGetResultModel>({
    url: Api.UPLOAD_FILE_LIST,
    params,
  });
