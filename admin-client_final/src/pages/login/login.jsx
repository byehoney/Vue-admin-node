import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {
  Form,
  Input,
  Icon,
  Button,
  message
} from 'antd'
import logo from '../../assets/images/logo.png'
import './login.less'

import {reqLogin} from '../../api'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'

const Item = Form.Item

/*
登陆路由组件
 */
class Login extends Component {

  login = (e) => {
    // 阻止事件默认行为(不提交表单)
    e.preventDefault();

    // 进行表单所有控件的校验
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // 校验成功
        // console.log(values);
        const {username, password} = values
        const result = await reqLogin(username, password);
        // 判断登录是否成功
        if (result.status === 0) {
          // 登录成功
          // 提示登录成功，保存用户登录信息，跳转到主页面
          message.success('登录成功');
          // 保存用户数据
          const user = result.data
          storageUtils.saveUser(user)
          memoryUtils.user = user
          // 跳转到后台管理路由(已经登录成功，不需要回退了)
          this.props.history.replace('/')
        } else {
          // 登录失败, 提示错误
          message.error(result.msg, 2)
        }
      } else {
        // 校验失败
        console.log(err)
      }
    })
  }

  /**
   * 自定义表单的校验规则
   */
  validator = (rule, value, callback) => {
    // console.log(rule, value);
    const length = value && value.length;
    const pwdReg = /^[a-zA-Z0-9_]+$/;
    if (!value) {
      // callback如果不传参代表校验成功，如果传参代表校验失败，并且会提示错误
      callback('必须输入密码');
    } else if (length < 4) {
      callback('密码必须大于4位');
    } else if (length > 12) {
      callback('密码必须小于12位');
    } else if (!pwdReg.test(value)) {
      callback('密码必须是英文、数组或下划线组成');
    } else {
      // 必须调用callback
      callback();
    }
  }

  render() {
    // 如果用户已经登陆, 自动跳转到admin
    if (memoryUtils.user && memoryUtils.user._id) {
      return <Redirect to='/'/>
    }

    const {getFieldDecorator} = this.props.form
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo"/>
          <h1>天迹运通管理系统</h1>
        </header>

        <section className='login-content'>
          <h3>用户登陆</h3>
          <Form onSubmit={this.login} className="login-form">
            <Item>
              {
                /*
                getFieldDecorator 是一个高阶函数(返回值是一个函数)
                getFieldDecorator(标识名称，配置对象)(组件标签) 返回新的标签
                经过 getFieldDecorator 包装的表单控件会自动添加 value和onChange，数据同步将被 form 接管
                 */
                getFieldDecorator('username', {
                  // 表单校验的规则
                  rules: [
                    {required: true, whitespace: true, message: '必须输入用户名'},
                    {min: 4, message: '用户名必须大于4位'},
                    {max: 12, message: '用户名必须小于12位'},
                    {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数组或下划线组成'}
                  ]
                })(
                  <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="用户名"/>
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    // 自定义表单校验规则
                    {validator: this.validator}
                  ]
                })(
                  <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                         placeholder="密码"/>
                )
              }
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}

export default Form.create()(Login)
