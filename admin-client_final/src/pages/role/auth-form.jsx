import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'

import menuList from '../../config/menuConfig'

const { TreeNode } = Tree

/*
用来设置角色权限的form组件
 */
export default class AuthForm extends PureComponent {

  static propTypes = {
    roleName: PropTypes.string,
    menus: PropTypes.array,
    setRoleMenus: PropTypes.func,
  }

  onCheck = (checkedKeys, info) => {
    // console.log('onCheck', checkedKeys, info);
    this.props.setRoleMenus(checkedKeys)
  }

  /*
  渲染多个TreeNode
   */
  renderTreeNodes = (menuList) => {
    return menuList.reduce((pre, menu) => {
      /*
      {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的path
        icon: 'home', // 图标名称
        children: []
      }
       */
      const node = (
        <TreeNode title={menu.title} key={menu.key}>
          {
            menu.children ?
              this.renderTreeNodes(menu.children)
              : null
          }
        </TreeNode>
      )
      pre.push(node)
      return pre
    }, [])
  }



  render() {

    const {roleName, menus} = this.props

    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    return (
      <Form>
        <Form.Item label="角色名称：" {...formItemLayout}>
          <Input value={roleName} disabled/>
        </Form.Item>

        <Tree
          checkable
          defaultExpandAll
          onCheck={this.onCheck}
          checkedKeys={menus}
        >
          <TreeNode title="平台权限" key="all">
            {this.renderTreeNodes(menuList)}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}