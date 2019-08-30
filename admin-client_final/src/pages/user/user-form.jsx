import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Select,
} from 'antd'

const FormItem = Form.Item
const Option = Select.Option

/*
用来添加或更新的form组件
 */
class UserForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    user: PropTypes.object,
    roles: PropTypes.array
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const states = [{status:'普通',id:1},{status:'冻结',id:2}]
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }

    const {user, roles} = this.props
    return (
      <Form>
        <FormItem label="用户名" {...formItemLayout}>
          {
            getFieldDecorator('username', {
              initialValue: user.username
            })(
              <Input type="text" placeholder="请输入用户名"/>
            )
          }
        </FormItem>

        {
          !user._id ?
            (
              <FormItem label="密码" {...formItemLayout}>
                {
                  getFieldDecorator('password', {
                    initialValue: ''
                  })(
                    <Input type="password" placeholder="请输入密码"/>
                  )
                }
              </FormItem>
            ) : null
        }



        <FormItem label="手机号" {...formItemLayout}>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone
            })(
              <Input type="phone" placeholder="请输入手机号"/>
            )
          }
        </FormItem>

        <FormItem label="邮箱" {...formItemLayout}>
          {
            getFieldDecorator('email', {
              initialValue: user.email
            })(
              <Input type="email" placeholder="请输入邮箱"/>
            )
          }
        </FormItem>
        <FormItem label="状态" {...formItemLayout}>
            {
                getFieldDecorator('state', {
                    initialValue: user.state
                })(
                  <Select style={{width: 200}}>
                    {
                      states.map(state => <Option key={state.id} value={state.id}>{state.status}</Option>)
                    }
                  </Select>
                )
            }
        </FormItem>

        <FormItem label="角色" {...formItemLayout}>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id
            })(
              <Select style={{width: 200}}>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </FormItem>
      </Form>
    )
  }
}

export default UserForm = Form.create()(UserForm)
