const {User} = require('./models')
const express = require('express')



const app = express()
const SECRET = 'dsfaggfgreh3'
const jwt = require('jsonwebtoken')

app.use(express.json())

app.get('/',async (req,res)=>{
  res.send('ok')
})

app.post('/api/register', async (req, res) => {
  // console.log(req.body)
  const user = await User.create({
    username:req.body.username,
    password:req.body.password,
  })
  res.send(user)
})

app.post('/api/login',async (req,res) => {
  const user = await User.findOne({
    username:req.body.username,
    // password:
  })
  if(!user){
    return res.status(422).send({
      message:'用户名不存在'
    })
  }
//比较这两个密码
  const isPasswordValid = require('bcrypt').compareSync(
    req.body.password,
    user.password
  )
  if(!isPasswordValid){
    return res.status(422).send({
      message:'密码无效'
    })
  }
  //生成token,那一串''是秘钥，全局保持唯一
  // const jwt = require('jsonwebtoken')
  //token里面绝对不要放密码，
  const token = jwt.sign({
    id:String(user._id),
  },SECRET)

  res.send({
    user,
    token
  })

})

//auth做中间件,可以复用，效率更高
const auth = async(req,res,next)=>{
  //常用来拿token pop弹出来的是bearer之后的一串字符串
  const raw = String(req.headers.authorization).split(' ').pop()
  //SECRET用于生成token，解密token；
  //用解构的方式，只要对象的id
  const {
    id
  } = jwt.verify(raw, SECRET)
  // console.log(tokenData)
  // return res.send('ok')
  //把user加在req上，就可以通过下面app.get访问
  req.user = await User.findById(id)
  next()
}

app.get('/api/profile',auth,async (req,res)=>{
  res.send(req.user)
})

// app.get('/api/orders',auth,async(req,res)=>{
//   const orders = await Order.find().where({
//     user:req.user
//   })
//   res.send(orders)
// })

app.listen(3001,()=>{
  console.log('http://localhost:3001')
})