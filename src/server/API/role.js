let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from role'
    db.query(sql,(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        if(data.length>0){
            res.send(data)
        }else{
            res.send({
                status:202,
                message:'获取数据失败'
            })
        }
    })
}
exports.add = (req,res) =>{          //添加角色
    var sql = 'insert into role (name,description) values(?,?)'
    db.query(sql,[req.query.form.name,req.query.form.description],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.update = (req,res) =>{          //通过name更新数据
    var sql = 'update role set name=?,description=? where name=?'
    db.query(sql,[req.query.form.name,req.query.form.description,req.query.form.name],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.del = (req,res) =>{          //通过name删除数据
    var sql = 'delete from role where name = ?'
    db.query(sql,[req.query.name],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'删除成功'
        })
    })
}