let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from checkPoint'
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
exports.getWorkShop = (req,res) => {
    var sql = 'select workshop from checkPoint where id=?'
    db.query(sql,[req.query.id],(err,data) =>{
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
exports.add = (req,res) =>{          //添加巡检点
    var sql = 'insert into checkPoint (id,name,workshop,lastTime,lastExecutor) values(?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.workshop,req.query.form.lastTime,req.query.form.lastExecutor],(err,data)=>{
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
    var sql = 'update checkPoint set id=?,name=?,workshop=?,lastTime=?,lastExecutor=? where id=?'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.workshop,req.query.form.lastTime,req.query.form.lastExecutor,req.query.form.id],(err,data)=>{
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
    var sql = 'delete from checkPoint where id = ?'
    db.query(sql,[req.query.id],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        console.log('data',data);
        res.send({
            status:200,
            message:'删除成功'
        })
    })
}