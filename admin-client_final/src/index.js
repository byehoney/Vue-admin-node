/*
入口js
 */
import React from 'react'
import ReactDOM from 'react-dom'

import storageUtils from './utils/storageUtils'
import memoryUtil from './utils/memoryUtils'

import App from './App'

// 将localStroage存储的user保存到内存中
const user = storageUtils.getUser()
if(user._id) { // 前面登陆过
  memoryUtil.user = user
}

ReactDOM.render(<App/>, document.getElementById('root'))