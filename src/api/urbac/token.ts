import { defHttp } from '/@/utils/http/axios';
import { TokenIDParams, TokenParams, TokenListGetResultModel } from './model/tokenModel';

enum Api {
  TOKEN_LIST = '/urbac/token/index',
  TOKEN_DELETE = '/urbac/token/delete',
}

/**
 * @description: Get sample list value
 */

export const tokenListApi = (params: TokenParams) =>
  defHttp.get<TokenListGetResultModel>({
    url: Api.TOKEN_LIST,
    params,
  });

export const tokenDelete = {
  premission: 'DELETE_' + Api.TOKEN_DELETE,
  api: (params: TokenIDParams) =>
    defHttp.delete<string>({
      url: Api.TOKEN_DELETE,
      params,
    }),
};
