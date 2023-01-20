import { defHttp } from '/@/utils/http/axios';
import { UserParams, UserListGetResultModel } from './model/userModel';

enum Api {
  USER_LIST = '/urbac/user/index',
  USER_ENABLE = '/urbac/user/enable',
  USER_DELETE = '/urbac/user/delete',
  USER_CREATE = '/urbac/user/create',
  USER_UPDATE = '/urbac/user/update',
  USER_RESET_PASSWORD = '/urbac/user/reset-password',
}

/**
 * @description: Get sample list value
 */

export const userList = {
  premission: 'GET_' + Api.USER_LIST,
  api: (params: UserParams) =>
    defHttp.get<UserListGetResultModel>({
      url: Api.USER_LIST,
      params,
    }),
};

export const userCreate = {
  premission: 'POST_' + Api.USER_CREATE,
  api: (params) =>
    defHttp.post<string>({
      url: Api.USER_CREATE,
      params,
    }),
};

export const userUpdate = {
  premission: 'POST_' + Api.USER_UPDATE,
  api: (params) =>
    defHttp.post<string>({
      url: Api.USER_UPDATE,
      params,
    }),
};

export const userResetPassword = {
  premission: 'POST_' + Api.USER_RESET_PASSWORD,
  api: (params) =>
    defHttp.post<string>({
      url: Api.USER_RESET_PASSWORD,
      params,
    }),
};

export const userEnable = {
  premission: 'POST_' + Api.USER_ENABLE,
  api: (params: { user_id: string; enable: boolean }) =>
    defHttp.post<string>({
      url: Api.USER_ENABLE,
      params,
    }),
};

export const userDelete = {
  premission: 'POST_' + Api.USER_DELETE,
  api: (params: { user_id: string; delete: boolean }) =>
    defHttp.post<string>({
      url: Api.USER_DELETE,
      params,
    }),
};

export const userRealDelete = {
  premission: 'DELETE_' + Api.USER_DELETE,
  api: (params: { user_id: string }) =>
    defHttp.delete<string>({
      url: Api.USER_DELETE,
      params,
    }),
};
