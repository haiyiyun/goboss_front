import { defHttp } from '/@/utils/http/axios';
import { RoleParams, RoleListGetResultModel } from './model/roleModel';

enum Api {
  ROLE_LIST = '/urbac/role/index',
  ROLE_ENABLE = '/urbac/role/enable',
  ROLE_DELETE = '/urbac/role/delete',
  ROLE_CREATE = '/urbac/role/create',
  ROLE_UPDATE = '/urbac/role/update',
}

/**
 * @description: Get sample list value
 */

export const roleList = {
  premission: 'GET_' + Api.ROLE_LIST,
  api: (params: RoleParams) =>
    defHttp.get<RoleListGetResultModel>({
      url: Api.ROLE_LIST,
      params,
    }),
};

export const roleCreate = {
  premission: 'PUT_' + Api.ROLE_CREATE,
  api: (params: { name: string; scope: number; enable: boolean; applications: any }) =>
    defHttp.put<string>({
      url: Api.ROLE_CREATE,
      params,
    }),
};

export const roleUpdate = {
  premission: 'POST_' + Api.ROLE_UPDATE,
  api: (params: { name: string; scope: number; enable: boolean; applications: any }) =>
    defHttp.post<string>({
      url: Api.ROLE_UPDATE,
      params,
    }),
};

export const roleEnable = {
  premission: 'POST_' + Api.ROLE_ENABLE,
  api: (params: { _id: string; enable: boolean }) =>
    defHttp.post<string>({
      url: Api.ROLE_ENABLE,
      params,
    }),
};

export const roleDelete = {
  premission: 'POST_' + Api.ROLE_DELETE,
  api: (params: { _id: string; delete: boolean }) =>
    defHttp.post<string>({
      url: Api.ROLE_DELETE,
      params,
    }),
};

export const roleRealDelete = {
  premission: 'DELETE_' + Api.ROLE_DELETE,
  api: (params: { _id: string }) =>
    defHttp.delete<string>({
      url: Api.ROLE_DELETE,
      params,
    }),
};
