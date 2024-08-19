import request from '@/utils/request'
import axios from 'axios'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'




const isMockEnabled = process.env.VUE_APP_MOCK === 'true'

export async function login(data) {
  if (isMockEnabled) {
    return request({
      url: '/vue-admin-template/user/login',
      method: 'post',
      data
    })
  } else {
    try {
      // 发送 POST 请求
      const response = await axios.post(process.env.VUE_APP_BASE_API + '/api/TokenAuth/Authenticate',
        {
          userNameOrEmailAddress: data.username,
          password: data.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Abp.TenantId': data.tenantname // 如果需要认证
          },
          timeout: 10000
        }
      );
      // 打印响应数据
      setToken(response.data.result.accessToken)
      // 返回结果
      return {
        code: 20000,
        data: response.data.result.accessToken
      };
    } catch (error) {
      // 处理请求错误
      console.error('POST request error:', error);
      // 可以选择抛出错误或返回一个错误对象
      return {
        code: error.response ? error.response.status : 500,
        message: error.message
      };
    }
  }
}

export async function getInfo(token) {
  if (isMockEnabled) {
    return request({
      url: '/vue-admin-template/user/info',
      method: 'get',
      params: { token }
    })
  } else {
    console.log('getInfo:'+token)
    return {
      code: 20000,
      data: {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin',
        tenant: 'invengotest'
      }
    }
  }
}

export async function logout() {
  if (isMockEnabled) {
    return request({
      url: '/vue-admin-template/user/logout',
      method: 'post'
    })
  } else {
    try {
      // 获取 token
      const token = getToken();
      console.log('Token to be sent:', token);
      // 发送 POST 请求
      const response = await axios.get(process.env.VUE_APP_BASE_API + '/api/TokenAuth/LogOut',
        {
          params: {
            //userNameOrEmailAddress: data.username,
            //password: data.password
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // 如果你的 API 使用 Bearer token 认证
          },
          timeout: 10000
        }
      );
      // 打印响应数据
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
      // 返回结果
      return {
        code: 20000,
        data: 'success'
      }
    } catch (error) {
      // 处理请求错误
      console.error('get request error:', error);
      // 可以选择抛出错误或返回一个错误对象
      return {
        code: error.response ? error.response.status : 500,
        message: error.message
      };
    }
  }
}
