const express = require('express')

const app = express()

//开启解析，允许处理json格式的数据
app.use(express.json())

//连接MongoDB
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser:true })

const Product = mongoose.model('Product',new mongoose.Schema({
  title:String,
}))

// Product.insertMany([
//   {title:'A'},
//   {
//     title: 'b'
//   },
//   {
//     title: 'c'
//   }
// ])

//解决跨域
app.use(require('cors')())

app.use('/',express.static('public'))

// app.get('/', function (req, res) {
//   res.send({
//     page: 'home'
//   })
// })

app.get('/about', function (req, res) {
  res.send({
    page: 'About us'
  })
})

app.get('/products',async function (req, res) {
  // const data =await Product.find().skip(1).limit(2)
  res.send(await Product.find())
})

//详情页接口，一般url后会跟一个商品相关的动态id,:开头表示任意字符，之后来捕获
app.get('/products/:id',async function (req,res) { 
  //req.params表示传递过来的所有参数，之后的.id是和url：后的id保持一致
  const data = await Product.findById(req.params.id)
  //发送用res，请求数据用req
  res.send(data)
 })

//产品新增接口
app.post('/products',async function (req,res) { 
  //req.body表示客户端用POST提交过来的所有数据
  const data = req.body
  //这句话可以使POST上去的数据格式自己带上_id之类的
  const product = await Product.create(data)
  res.send(product)
 })

//patch表示部分修改，put全部覆盖
app.put('/products/:id', async function (req, res) { //赋值、保存、返回
  const product = await Product.findById(req.params.id)
  product.title = req.body.title
  await product.save()
  res.send(product)
})

//删除产品
app.delete('/products/:id',async function (req,res) {
  const product = await Product.findById(req.params.id)
  await product.remove()
  res.send({
    success:true
  })
})

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
