let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from checkPath'
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
exports.getPoints = (req,res) => {          //巡检点选择
    var sql = 'select id from checkPoint'
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
exports.checkPoints = (req,res) => {           //当前工单的巡检点
    var sql = 'select check_Point,checkSequence,workshop from points where id = ?'
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
exports.savaCheckPoints = (req,res) =>{          //为当前工单添加巡检点
    var sql = 'insert into points (id,check_Point,checkSequence,workshop) values(?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.check_Point,req.query.form.checkSequence,req.query.form.workshop],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.delPoint = (req,res) =>{          //删除当前巡检点
    var sql = 'delete from points where id = ? and check_Point = ? and checkSequence = ?'
    db.query(sql,[req.query.form.id,req.query.form.check_Point,req.query.form.checkSequence],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'删除成功'
        })
    })
}
exports.add = (req,res) =>{          //添加巡检路线
    var sql = 'insert into checkPath (id,name,workshop,status,latestTime,latestExecutor,executor,lastTime,nextTime,period) values(?,?,?,?,?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.workshop,req.query.form.status,req.query.form.latestTime,req.query.form.latestExecutor,req.query.form.executor,req.query.form.lastTime,req.query.form.nextTime,req.query.form.period],(err,data)=>{
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
    var sql = 'update checkPath set id=?,name=?,workshop=?,status=?,latestTime=?,latestExecutor=?,executor=?,lastTime=?,nextTime=?,period=?,isStart=? where id=?'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.workshop,req.query.form.status,req.query.form.latestTime,req.query.form.latestExecutor,req.query.form.executor,req.query.form.lastTime,req.query.form.nextTime,req.query.form.period,req.query.form.isStart,req.query.form.id],(err,data)=>{
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
    var sql = 'delete from checkPath where id = ?'
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