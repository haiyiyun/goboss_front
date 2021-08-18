import { defHttp } from '/@/utils/http/axios';
import { LogParams, LogListGetResultModel } from './model/logModel';

enum Api {
  LOG_LIST = '/log/log/index',
}

/**
 * @description: Get sample list value
 */

export const logListApi = (params: LogParams) =>
  defHttp.get<LogListGetResultModel>({
    url: Api.LOG_LIST,
    params,
  });
