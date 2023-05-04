let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from equipmentAcount'
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
exports.add = (req,res) =>{          //向设备台账添加数据
    var sql = 'insert into equipmentAcount (id,name,description,workshop,classify,type,status,executor) values(?,?,?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.description,req.query.form.workshop,req.query.form.classify,req.query.form.type,req.query.form.status,req.query.form.executor],(err,data)=>{
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
    var sql = 'update equipmentAcount set id=?,name=?,description=?,workshop=?,classify=?,type=?,status=?,executor=? where id=?'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.description,req.query.form.workshop,req.query.form.classify,req.query.form.type,req.query.form.status,req.query.form.executor,req.query.form.id],(err,data)=>{
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
    var sql = 'delete from equipmentAcount where id = ?'
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