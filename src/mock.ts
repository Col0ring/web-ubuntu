import Mock from 'mockjs'

Mock.mock('/mock/user/getUserInfo', 'get', () => {
  return {
    message: 'ok',
    status: 200,
    data: { username: 'Col0ring', email: 'xylCol0ring@gmail.com' },
  }
})

Mock.mock('/mock/user/login', 'post', () => {
  return {
    status: 200,
    message: 'ok',
    data: {
      token: 'this is a token',
    },
  }
})
