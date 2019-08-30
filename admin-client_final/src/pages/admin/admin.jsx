import React, {Component} from 'react'
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import {Layout} from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

import Home from '../home'
import Category from '../category/category.jsx'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from "../not-found/not-found"

const {Sider, Content, Footer} = Layout

/*
后台管理路由组件
 */
export default class Admin extends Component {
  render() {

    // 如果用户没有登陆, 自动跳转到登陆界面
    if (!memoryUtils.user || !memoryUtils.user._id) {
      // 跳转
      // this.props.history.replace('/login')  // 常用在事件回调函数中
      return <Redirect to='/login'/>  // 渲染此组件标签的效果: 自动跳转到指定的路由  (常用在render()中)
    }

    return (
      <Layout style={{minHeight: '100%'}}>

        <Sider>
          <LeftNav/>
        </Sider>

        <Layout>
          <Header/>
          <Content style={{margin: '18px 18px 0 18px'}}>
            <Switch>
              <Redirect from='/' exact to='/home'/>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/user' component={User}/>
              <Route path='/role' component={Role}/>
              <Route path="/charts/bar" component={Bar}/>
              <Route path="/charts/pie" component={Pie}/>
              <Route path="/charts/line" component={Line}/>
              <Route component={NotFound}/>
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#aaaaaa'}}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    )
  }
}