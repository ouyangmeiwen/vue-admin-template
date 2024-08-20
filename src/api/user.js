import request from '@/utils/request'
import axios from 'axios'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'
import isMockEnabled from '@/utils/mockconfig'


async function checkTenant(tenantid) {
  const isnum = Number.isFinite(Number(tenantid));
  if (isnum) {
    return tenantid
  } else {
    try {
      const response = await axios.post(process.env.VUE_APP_BASE_API + '/api/services/app/Account/IsTenantAvailable',
        {
          tenancyName: tenantid,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      return response.data.result.tenantId
    } catch (error) {
      console.error('POST request error:', error);
      return null;
    }
  }
}


export async function login(data) {
  if (isMockEnabled) {
    return request({
      url: '/vue-admin-template/user/login',
      method: 'post',
      data
    })
  } else {
    try {
      const tenantid = await checkTenant(data.tenantname)
      const tenantidInput = tenantid ? tenantid : data.tenantname
      console.log(tenantidInput);
      const response = await axios.post(process.env.VUE_APP_BASE_API + '/api/TokenAuth/Authenticate',
        {
          userNameOrEmailAddress: data.username,
          password: data.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Abp.TenantId': tenantidInput // 如果需要认证
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
