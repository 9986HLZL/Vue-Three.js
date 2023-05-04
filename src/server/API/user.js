let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from user where id = ? and password = ?'
    db.query(sql,[req.query.id,req.query.pass],(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        if(data.length>0){
            res.send({
                status:200,
                id:data,
                message:'登录成功'
            })
        }else{
            res.send({
                status:202,
                message:'登录失败'
            })
        }
    })
}
exports.userGet = (req,res) => {
    var sql = 'select * from user'
    db.query(sql,(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.add = (req,res) =>{          //向账号添加数据
    var sql = 'insert into user (id,name,password,role,phone,email) values(?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.password,req.query.form.role,req.query.form.phone,req.query.form.email],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.update = (req,res) =>{          //通过id更新数据
    var sql = 'update user set id=?,name=?,password=?,role=?,phone=?,email=? where id=?'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.password,req.query.form.role,req.query.form.phone,req.query.form.email,req.query.form.id],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.del = (req,res) =>{          //通过id删除数据
    var sql = 'delete from user where id = ?'
    db.query(sql,[req.query.id],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'删除成功'
        })
    })
}
exports.saveUser = (req,res) => { //保存个人信息
    var sql = 'update user set phone=?,email=? where id=?'
    db.query(sql,[req.query.form.phone,req.query.form.email,req.query.form.id],(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.updatePass = (req,res) => { //保存个人信息
    var sql = 'update user set password=? where id=?'
    db.query(sql,[req.query.form.password,req.query.form.id],(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}