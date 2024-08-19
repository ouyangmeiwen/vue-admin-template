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
      setToken(response.data.result.accessToken)
      return {
        code: 20000,
        data: {
          token: response.data.result.accessToken
        }
      };
    } catch (error) {
      console.error('POST request error:', error);
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
    console.log('getInfo:' + token)
    try {
      const response = await axios.get(process.env.VUE_APP_BASE_API + '/api/services/app/Session/GetCurrentLoginInformations',
        {
          params: {

          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000
        }
      );
      return {
        code: 20000,
        data: {
          roles: ['admin'],
          introduction: 'I am a super administrator',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: response.data.result.user.surname,
          tenant: response.data.result.tenant.name
        }
      }
    } catch (error) {
      console.error('POST request error:', error);
      return {
        code: error.response ? error.response.status : 500,
        message: error.message
      };
    }
  }
}

export async function logout(token) {
  if (isMockEnabled) {
    return request({
      url: '/vue-admin-template/user/logout',
      method: 'post'
    })
  } else {
    try {
      const response = await axios.get(process.env.VUE_APP_BASE_API + '/api/TokenAuth/LogOut',
        {
          params: {
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          timeout: 10000
        }
      );
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
      return {
        code: 20000,
        data: 'success'
      }
    } catch (error) {
      console.error('get request error:', error);
      return {
        code: error.response ? error.response.status : 500,
        message: error.message
      };
    }
  }
}
