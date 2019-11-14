const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/express-auth',{
  useNewUrlParser:true,
  useCreateIndex:true
})
//定义单独的文件，需要导出
const UserSchema = new mongoose.Schema({
  username:{type:String,unique:true},
  //密码加密,同步的方法把密码散列
  password:{type:String,
            set(val){
              //hashSync中有两个参数，10表示加密倍数
              return require('bcrypt').hashSync(val,10)
            }},
})
const User = mongoose.model('User',UserSchema)
module.exports={User}
// 删除用户集合
// User.db.dropCollection('users')

