let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from luboil'
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
    var sql = 'insert into luboil (id,description,manufacturer,minimum,quantity,unit,price,executor) values(?,?,?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.description,req.query.form.manufacturer,req.query.form.minimum,req.query.form.quantity,req.query.form.unit,req.query.form.price,req.query.form.executor],(err,data)=>{
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
    var sql = 'update luboil set id=?,description=?,manufacturer=?,minimum=?,quantity=?,unit=?,price=?,executor=? where id=?'
    db.query(sql,[req.query.form.id,req.query.form.description,req.query.form.manufacturer,req.query.form.minimum,req.query.form.quantity,req.query.form.unit,req.query.form.price,req.query.form.executor,req.query.form.id],(err,data)=>{
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
    var sql = 'delete from luboil where id = ?'
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
exports.change = (req,res) =>{          //出入库操作
    var sql = 'insert into inventoryrecords (id,quantity,operate,x,y,z) values(?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.quantity,req.query.form.operate,req.query.form.x,req.query.form.y,req.query.form.z],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'操作成功'
        })
    })
}