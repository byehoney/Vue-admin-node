/*
包含n个接口请求函数的模块
根据接口文档编写(一定要具备这个能力)
接口请求函数: 使用ajax(), 返回值promise对象
 */
import jsonp from 'jsonp'
import ajax from './ajax'

// const BASE = 'http://localhost:5000'
const BASE = ''

// 登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

// 获取用户列表
export const reqUsers = () => ajax('/manage/user/list')

// 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')


// 获取一级或某个二级分类列表
export const reqCategorys = (parentId = '0') => ajax('/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {
  parentId,
  categoryName
}, 'POST')

// 更新品类名称
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {
  categoryId,
  categoryName
}, 'POST')

// 根据分类ID获取分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

// 根据ID/Name搜索产品分页列表
export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => ajax('/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})

// 添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'post')

// 对商品进行上架/下架处理
export const reqUpdateProductStatus = (productId, status) => ajax('/manage/product/updateStatus', {
  productId,
  status
}, 'POST')

// 删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'post')

// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')

// 获取角色列表
export const reqRoles = () => ajax('/manage/role/list')

// 更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

// 删除角色
export const reqDelRole = (id) => ajax('/manage/role/del', {id}, 'POST')


/*
通过jsonp请求获取天气信息
 */
export function reqWeather(city) {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  return new Promise((resolve, reject) => {
    jsonp(url, {
      param: 'callback'
    }, (error, response) => {
      if (!error && response.status === 'success') {
        const {dayPictureUrl, weather} = response.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        alert('获取天气信息失败')
      }
    })
  })
}
