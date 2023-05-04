let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from checkTask'
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
exports.createTask = (req,res) =>{          //添加巡检任务
    var sql = 'insert into checkTask (id,workshop,executor,status,check_Point,pathId,checkSequence) values(?,?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.workshop,req.query.form.executor,req.query.form.status,req.query.form.check_Point,req.query.form.pathId,req.query.form.checkSequence],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.checkCarStart = (req,res) =>{          //开始巡检任务命令
    var sql = "update checkTask set status='进行中' where id=?"
    db.query(sql,[req.query.id],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.finish = (req,res) =>{          //完成任务命令，在巡检记录出现任务
    var sql = "update checkTask set status='已完成' where id=?"
    db.query(sql,[req.query.id],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.updatePathTime = (req,res) =>{          //更新巡检路线最近巡检时间
    var sql = "update checkPath set latestTime=?,latestExecutor=? where id=?"
    db.query(sql,[req.query.form.latestTime,req.query.form.latestExecutor,req.query.form.id],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.updatePointTime = (req,res) =>{          //更新巡检点最近巡检时间，检查人
    var sql = "update checkPoint set lastTime=?,lastExecutor=? where id=?"
    db.query(sql,[req.query.form.lastTime,req.query.form.lastExecutor,req.query.form.id],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
