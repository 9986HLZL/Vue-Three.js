let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from equipmentParts'
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
exports.add = (req,res) =>{          //向设备部件添加数据
    var sql = 'insert into equipmentParts (id,name,description,workshop,equipmentName,quantity) values(?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.description,req.query.form.workshop,req.query.form.equipmentName,req.query.form.quantity],(err,data)=>{
        if(err){
            console.log('req.query',req.query);
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.update = (req,res) =>{          //通过id更新数据
    var sql = 'update equipmentParts set id=?,name=?,description=?,workshop=?,equipmentName=?,quantity=? where id=?'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.description,req.query.form.workshop,req.query.form.equipmentName,req.query.form.quantity,req.query.form.id],(err,data)=>{
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
    var sql = 'delete from equipmentParts where id = ?'
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