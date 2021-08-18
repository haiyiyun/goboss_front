import { defHttp } from '/@/utils/http/axios';
import { ApplicationListGetResultModel } from './model/applicationModel';

enum Api {
  APPLICATION_LIST = '/urbac/application/index',
  APPLICATION_ROUTE_LIST = '/urbac/application/route-list',
  APPLICATION_CREATE_VIRTUAL_APPLICATION = '/urbac/application/create-virtual-application',
  APPLICATION_CREATE_CODE_APPLICATION = '/urbac/application/create-code-application',
  APPLICATION_READ_CODE_APPLICATION = '/urbac/application/read-code-application',
  APPLICATION_DELETE = '/urbac/application/delete',
  APPLICATION_ENABLE = '/urbac/application/enable',
  APPLICATION_HIDE = '/urbac/application/hide',
  APPLICATION_UPDATE = '/urbac/application/update',
}

/**
 * @description: Get sample list value
 */

export const applicationList = {
  premission: 'GET_' + Api.APPLICATION_LIST,
  api: (params) =>
    defHttp.get<ApplicationListGetResultModel>({
      url: Api.APPLICATION_LIST,
      params,
    }),
};

export const applicationRouteList = {
  premission: 'GET_' + Api.APPLICATION_ROUTE_LIST,
  api: () =>
    defHttp.get<string>({
      url: Api.APPLICATION_ROUTE_LIST,
    }),
};

export const applicationCreateVirtualApplication = {
  premission: 'PUT_' + Api.APPLICATION_CREATE_VIRTUAL_APPLICATION,
  api: (params) =>
    defHttp.put<string>({
      url: Api.APPLICATION_CREATE_VIRTUAL_APPLICATION,
      params,
    }),
};

export const applicationCreateCodeApplication = {
  premission: 'PUT_' + Api.APPLICATION_CREATE_CODE_APPLICATION,
  api: (params) =>
    defHttp.put<string>({
      url: Api.APPLICATION_CREATE_CODE_APPLICATION,
      params,
    }),
};

export const applicationReadCodeApplication = {
  premission: 'POST_' + Api.APPLICATION_READ_CODE_APPLICATION,
  api: (params) =>
    defHttp.post<string>({
      url: Api.APPLICATION_READ_CODE_APPLICATION,
      params,
    }),
};

export const applicationDelete = {
  premission: 'DELETE_' + Api.APPLICATION_DELETE,
  api: (params) =>
    defHttp.delete<string>({
      url: Api.APPLICATION_DELETE,
      params,
    }),
};

export const applicationEnable = {
  premission: 'POST_' + Api.APPLICATION_ENABLE,
  api: (params) =>
    defHttp.post<string>({
      url: Api.APPLICATION_ENABLE,
      params,
    }),
};

export const applicationHide = {
  premission: 'POST_' + Api.APPLICATION_HIDE,
  api: (params) =>
    defHttp.post<string>({
      url: Api.APPLICATION_HIDE,
      params,
    }),
};

export const applicationUpdate = {
  premission: 'POST_' + Api.APPLICATION_UPDATE,
  api: (params) =>
    defHttp.post<string>({
      url: Api.APPLICATION_UPDATE,
      params,
    }),
};
