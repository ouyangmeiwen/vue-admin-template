import request from '@/utils/request'
import axios from 'axios'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'

const isMockEnabled = process.env.VUE_APP_MOCK === 'true'

export async function getList(params) {
  if (isMockEnabled) {
    return request({
      url: '/vue-admin-template/table/list',
      method: 'get',
      params
    })
  } else {
    var token=getToken();
    try {
      var response = await axios.get(process.env.VUE_APP_BASE_API + '/api/services/app/ItemEntities/GetAllOPAC',
        {
          params: {
            SkipCount:0,
            MaxResultCount:100
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000
        }
      );
      var items=[]
      for (let index = 0; index < response.data.result.items.length; index++) {
        var elements = response.data.result.items[index].items;
        for (let index2 = 0; index2 < elements.length; index2++) {
          const element = elements[index2].item;
          console.log(element)
          items.push({
            id:element.id,
            barcode:element.barcode,
            title:element.title,
            author:element.author,
            pageviews:element.pages,
            status:element.itemState,
            display_time:element.lastModificationTime,
          })
        }
      }
      return {
        code: 20000,
        data: {
          total: response.data.result.totalCount,
          items: items
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



export async function getALL(params) {
  if (isMockEnabled) {
    return request({
      url: '/vue-admin-template/table/list',
      method: 'get',
      params
    })
  } else {
    var token=getToken();
    console.log('getALL-token:'+token)
    try {
      var response = await axios.get(process.env.VUE_APP_BASE_API + '/api/services/app/ItemEntities/GetAll',
        {
          params: {
            SkipCount:params.Skip,
            MaxResultCount:params.MaxResult
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000
        }
      );
      var items=[]
      for (let index = 0; index < response.data.result.items.length; index++) {
        var element = response.data.result.items[index].itemEntity;
        items.push({
          id:element.id,
          barcode:element.barcode,
          title:element.title,
          author:element.author,
          pageviews:element.pages,
          status:element.itemState,
          display_time:element.creationTime,
        })
      }
      return {
        code: 20000,
        data: {
          total: response.data.result.totalCount,
          items: items
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