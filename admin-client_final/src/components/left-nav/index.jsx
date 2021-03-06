import React, {Component} from 'react'
import {Menu, Icon} from 'antd'
import {Link, withRouter} from 'react-router-dom'
import './index.less'
import menuList from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import MemoryUtils from "../../utils/memoryUtils";

const SubMenu = Menu.SubMenu

/*
左侧导航
 */
class LeftNav extends Component {

  /*
  判断当前用户是否有指定item对应的权限
   */
  hasAuth = (item) => {

    /*
    1. item是公开的
    2. 当前用户是admin
    3. 当前用户的权限key集合中包含item的key
     */
    if(item.isPublic || MemoryUtils.user.username==='admin' || this.menuSet.has(item.key)) {
      return true
      // 如果当前用户有item的children中的某个子节点的权限
    } else if (item.children && item.children.find(cItem => this.menuSet.has(cItem.key))) {
      return true
    }

    return false
  }

  /*
  返回包含n个<Item>和<SubMenu>的数组
  1. 使用arr的map()实现二级菜单
  2. 使用arr的reduce()实现二级菜单
      arr.reduce((pre, item) => pre + (item%2===0 ? item : 0), 0)
  3. 使用arr的reduce() + 递归实现三级菜单
  */

  getMenuNodes = (list) => {
    return list.reduce((pre, item) => { // item ==> MenuItem/ SubMenu
      // 如果当前用户有item对应的权限才进入
      if(this.hasAuth(item)) {
        if(!item.children) {
          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else {// item有children才去递归调用

          // 确定openKey的值, 并保存到组件对象
          const path = this.props.location.pathname
          const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
          if(cItem) {
            const openKey = item.key
            this.openKey = openKey
          }


          pre.push((
            <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
              {
                this.getMenuNodes(item.children)
              }
            </SubMenu>
          ))
        }
      }
      return pre
    }, [])
  }

  /*
  在第一次render()前调用一次
  componentWillMount: 在第一次render()前调用一次, 为第一次render()准备数据(同步)
  componentDidMount: 在第一次render()之后调用一次, 启动异步任务, 后面异步更新状态重新render
  */
  componentWillMount () {

    // 得到当前用户的权限menus, 并封装成set保存
    this.menuSet = new Set(MemoryUtils.user.role.menus || [])

    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {

    // 获取<menu>所有子节点
    const menuNodes = this.menuNodes
    console.log('LeftNav render()', menuNodes)

    // 得到请求的路由路径
    let selectKey = this.props.location.pathname
    // 如果请求的路径是商品的子路由路径, selectKey置为商品的key
    if(selectKey.indexOf('/product/')===0) {
      selectKey = '/product'
    }
    const openKey = this.openKey

    return (
      <div>

        <Link className='logo-link' to='/home'>
          <img src={logo} alt="logo"/>
          <h1>天迹运通</h1>
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectKey]}
          defaultOpenKeys={[openKey]}
        >
          {menuNodes}
        </Menu>
      </div>
    )
  }
}

/*
withRouter(): 高阶组件
接收的是非路由组件: LeftNav
返回的是包装产生的新组件: 向LeftNav中传入history/location/match三个属性
 */
export default withRouter(LeftNav)
