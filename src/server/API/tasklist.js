let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from tasklist'
    db.query(sql,(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        if(data.length>0){
            res.send(data)
        }else{
            res.send({
                status:202,
                message:'删除失败'
            })
        }
    })
}
exports.waitingTaskGet = (req,res) => {
    var sql = "select * from tasklist where 任务状态 = '未执行'"
    db.query(sql,(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.acceptableTaskGet = (req,res) => {
    var sql = "select * from tasklist where 任务状态 = '待验收'"
    db.query(sql,(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.del = (req,res) =>{          //通过任务编号删除数据
    var sql = 'delete from tasklist where 任务编号 = ?'
    db.query(sql,[req.query.任务编号],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'删除成功'
        })
    })
}
exports.add = (req,res) =>{          //向list表添加数据
    var sql = 'insert into tasklist values(?,?,?,?,?)'
    db.query(sql,[req.query.form.任务编号,req.query.form.任务名称,req.query.form.任务描述,req.query.form.执行人,req.query.form.任务状态],(err,data)=>{
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
exports.update = (req,res) =>{          //通过任务编号更新数据
    var sql = 'update tasklist set 任务编号=?,任务名称=?,任务描述=?,执行人=?,任务状态=? where 任务编号=?'
    db.query(sql,[req.query.form.任务编号,req.query.form.任务名称,req.query.form.任务描述,req.query.form.执行人,req.query.form.任务状态,req.query.form.任务编号],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.sendOrder = (req,res) =>{          //下发命令，任务状态改为进行中
    var sql = "update tasklist set 任务状态='进行中' where 任务编号=?"
    db.query(sql,[req.query.任务编号],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.acceptOrder = (req,res) =>{          //确认验收，任务状态改为已验收
    var sql = "update tasklist set 任务状态='已验收' where 任务编号=?"
    db.query(sql,[req.query.任务编号],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}