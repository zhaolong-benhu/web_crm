/**
 * Created by lily on 28/02/2017.
 */
import { baseURL } from '../config'
import {singleApi} from '../helper/reduxFetch'
export const GIFT_DEFULATE_DATA_LIST = 'GIFT_DEFULATE_DATA_LIST' // 获取礼品列表
export const GET_DELIVERY_BY_ID = 'GET_DELIVERY_BY_ID' //根据ID获取邮寄信息
export const ADD_ORUPD_GIFT = 'ADD_ORUPD_GIFT' //根据ID获取邮寄信息

export const getDeliveryList = singleApi({ // 获取礼品列表
  url: baseURL() + '/delivery/getDeliveryList',
  action: (args, json) => {
    return {
      args,
      type: GIFT_DEFULATE_DATA_LIST,
      data: json,
    }
  },
})

export const getDeliveryById = singleApi({ // 根据ID获取邮寄信息
  url: baseURL() + '/delivery/getDeliveryById',
  action: (args, json) => {
    return {
      args,
      type: GET_DELIVERY_BY_ID,
      data: json,
    }
  },
})

export const addOrUpdGiftInv = singleApi({ // 添加或修改礼品寄送
  url: baseURL() + '/delivery/addOrUpdGiftInv',
  action: (args, json) => {
    return {
      args,
      type: ADD_ORUPD_GIFT,
      data: json,
    }
  },
})
