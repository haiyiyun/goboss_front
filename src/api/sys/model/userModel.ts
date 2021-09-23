/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user setting information return value
 */
export interface GetUserInfoSettingModel {
  home_path?: string;
  profile?: any;
  style?: any;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  user_id: string | number;
  // 用户名
  username: string;
  // email
  email: string;
  // 真实名字
  real_name: string;
  // 头像
  avatar: string;
  // 介绍
  description?: string;
  //设置
  setting: GetUserInfoSettingModel;
}
