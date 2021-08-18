import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';

export function createFakeUserList() {
  return [
    {
      userId: '61024a613106cf921bf37c85',
      username: 'vben',
      realName: 'Vben Admin',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
      desc: 'manager',
      password: '123456',
      token: `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MTAyNGE2MTMxMDZjZjkyMWJmMzdjODUiLCJleHAiOjE2Mjc2MjcyMjMsImp0aSI6IjYxMDI0ZDU3MzEwNmNmOTIxYmYzN2M4ZCIsInN1YiI6IjYxMDI0YTYxMzEwNmNmOTIxYmYzN2M4NSIsInRva2VuX3R5cGUiOiJzZWxmIn0.IPl4z4E5WXbGu-ejjiL9xbfWnwgWkPIbz4MYUjdXyb6xWhnlvIFumbgcVRXPMWKQCBeDJmQfEcpp6J6u5t9kPg`,
      homePath: '/dashboard/analysis',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
    {
      userId: '2',
      username: 'test',
      password: '123456',
      realName: 'test user',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640',
      desc: 'tester',
      token: 'fakeToken2',
      homePath: '/dashboard/workbench',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
    },
  ];
}

const fakeCodeList: any = {
  '1': ['1000', '3000', '5000'],

  '2': ['2000', '4000', '6000'],
};
export default [
  // mock user login
  // {
  //   url: '/basic-api/login',
  //   timeout: 200,
  //   method: 'post',
  //   response: ({ body }) => {
  //     const { username, password } = body;
  //     const checkUser = createFakeUserList().find(
  //       (item) => item.username === username && password === item.password
  //     );
  //     if (!checkUser) {
  //       return resultError('Incorrect account or password！');
  //     }
  //     const { userId, username: _username, token, realName, desc, roles } = checkUser;
  //     return resultSuccess({
  //       roles,
  //       userId,
  //       username: _username,
  //       token,
  //       realName,
  //       desc,
  //     });
  //   },
  // },
  // {
  //   url: '/basic-api/getUserInfo',
  //   method: 'get',
  //   response: (request: requestParams) => {
  //     const token = getRequestToken(request);
  //     if (!token) return resultError('Invalid token');
  //     const checkUser = createFakeUserList().find((item) => item.token === token);
  //     if (!checkUser) {
  //       return resultError('The corresponding user information was not obtained!');
  //     }
  //     return resultSuccess(checkUser);
  //   },
  // },
  {
    url: '/basic-api/getPermCode',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      const codeList = fakeCodeList[checkUser.userId];

      return resultSuccess(codeList);
    },
  },
  // {
  //   url: '/basic-api/logout',
  //   timeout: 200,
  //   method: 'get',
  //   response: (request: requestParams) => {
  //     const token = getRequestToken(request);
  //     if (!token) return resultError('Invalid token');
  //     const checkUser = createFakeUserList().find((item) => item.token === token);
  //     if (!checkUser) {
  //       return resultError('Invalid token!');
  //     }
  //     return resultSuccess(undefined, { message: 'Token has been destroyed' });
  //   },
  // },
] as MockMethod[];
