import React, {Component} from 'react'
import {
  Card,
  Icon,
  Form,
  Input,
  Cascader,
  Button,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'

const {Item} = Form

/*
商品添加/更新的路由组件
 */
class ProductAddUpdate extends Component {

  state = {
    options: [], // 用来显示级联列表的数组
  }

  constructor(props) {
    super(props);
    this.pw = React.createRef();
    this.editor = React.createRef();
  }

  /*
  选择某个分类项时的回调
  加载对应的二级分类显示
   */
  loadData = async (selectedOptions) => {
    // console.log('loadDate()', selectedOptions)
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true // 显示loading

    // 异步请求获取对应的二级分类列表
    await this.getCategorys(targetOption.value) // await的作用: 保证完成执行完保存的分类数组才进入后面的语句
    const subCategorys = this.subCategorys
    targetOption.loading = false // 隐藏loading
    if(subCategorys && subCategorys.length>0) { // 有子分类
      // 生成一个二级的options
      const cOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))

      // 添加为对应的option的children(子options)
      targetOption.children = cOptions
    } else { // 没有子分类
      targetOption.isLeaf = true
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options],
    });

  }

  /*
  获取指定分类id的子分类列表
  如果parentId为0时获取一级列表
   */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if(result.status===0) {
      const categorys = result.data
      if(parentId==='0') {
        // 保存一级分类列表
        this.categorys = categorys
        this.initOptions()
      } else {
        // 保存分类列表
        this.subCategorys = categorys
      }
    }
  }

  /*
  生成级联的一级列表
   */
  initOptions = async () => {
    // 根据一级分类数组生成option的数组
    const options = this.categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))

    // 如果当前是更新, 且商品是一个二级分类的商品
    const {product, isUpdate} = this
    if(isUpdate && product.pCategoryId!=='0') {

      // 异步获取product.pCategoryId的二级分类列表
      await this.getCategorys(product.pCategoryId)
      const {subCategorys} = this

      // 生成二级的option数组
      const cOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))

      // 找到对应的option
      const option = options.find(option => option.value===product.pCategoryId)

      // 将cOptions添加为对应的一级option的children
      option.children = cOptions
    }

    // 更新状态
    this.setState({
      options
    })
  }

  // 添加/更新
  submit = async () => {
    // 收集产品相关信息
    const {name, desc, price, categorys} = this.props.form.getFieldsValue()
    // 在父组件中得到子组件对象, 调用子组件对象的方法
    const imgs = this.pw.current.getImgs()
    const detail = this.editor.current.getDetail()

    let pCategoryId = ''
    let categoryId = ''
    if(categorys.length===1) { // 选择的是一级分类
      pCategoryId = '0'
      categoryId = categorys[0]
    } else { // 选择的是二级分类
      pCategoryId = categorys[0]
      categoryId = categorys[1]
    }
    // 封装成对象
    const product = {name, desc, price, pCategoryId, categoryId, detail, imgs}
    // 如果是更新, 指定product的_id属性值
    if(this.isUpdate) {
      product._id = this.product._id
    }
    // 请求保存
    const result = await reqAddOrUpdateProduct(product)
    if(result.status===0) {
      message.success('保存商品成功')
      this.props.history.goBack()
    } else {
      message.success('保存商品失败')
    }

  }

  componentDidMount () {
    // 异步获取一级分类列表
    this.getCategorys('0')
  }

  componentWillMount () {
    // 取出跳转传入的数据
    const product = this.props.location.state
    this.product = product || {}
    this.isUpdate = !!product   // !!xxx将一个数据强制转换成布尔类型
  }

  render() {

    const {product, isUpdate} = this
    const {pCategoryId, categoryId} = product
    const {options} = this.state
    const {getFieldDecorator} = this.props.form

    // 准备用于级联列表显示的数组
    const categorys = []
    if(isUpdate) {
      if(pCategoryId==='0') {
        categorys.push(categoryId)
      } else {
        categorys.push(pCategoryId)
        categorys.push(categoryId)
      }
    }


    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20}}/>
        </LinkButton>
        {isUpdate ? '修改商品' : '添加商品'}
      </span>
    )

    // 指定form的item布局的对象
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    }

    return (
      <Card title={title}>
        <Form>
          <Item label="商品名称" {...formItemLayout}>
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [{required: true, message: '商品名称必须输入'}]
              })(
                <Input placeholer='请输入商品名称'/>
              )
            }
          </Item>
          <Item label="商品描述" {...formItemLayout}>
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
              })(
                <Input placeholer='请输入商品描述'/>
              )
            }
          </Item>
          <Item label="商品价格" {...formItemLayout}>
            {
              getFieldDecorator('price', {
                initialValue: product.price,
              })(
                <Input type='number' placeholer='请输入商品价格' addonAfter='元'/>
              )
            }
          </Item>
          <Item label="商品分类" {...formItemLayout}>
            {
              getFieldDecorator('categorys', {
                initialValue: categorys,
              })(
                <Cascader
                  options={options}
                  loadData={this.loadData}
                />
              )
            }
          </Item>
          <Item label="商品图片" {...formItemLayout}>
            <PicturesWall ref={this.pw} imgs={product.imgs}/>
          </Item>
          <Item
            label="商品详情"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={this.editor} detail={product.detail}/>
          </Item>
          <Button type='primary' onClick={this.submit}>提交</Button>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)