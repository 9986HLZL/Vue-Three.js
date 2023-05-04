let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from repairTask'
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
exports.waitingTaskGet = (req,res) => {
    var sql = "select * from repairTask where status in('进行中','未执行')"
    db.query(sql,(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.acceptableTaskGet = (req,res) => {
    var sql = "select * from repairTask where status = '待验收'"
    db.query(sql,(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.add = (req,res) =>{          //添加维修工单
    var sql = 'insert into repairTask (id,name,description,workshop,startTime,endTime,status,executor,sender) values(?,?,?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.description,req.query.form.workshop,req.query.form.startTime,req.query.form.endTime,req.query.form.status,req.query.form.executor,req.query.form.sender],(err,data)=>{
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
    var sql = 'update repairTask set id=?,name=?,description=?,workshop=?,startTime=?,endTime=?,status=?,executor=?,sender=? where id=?'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.description,req.query.form.workshop,req.query.form.startTime,req.query.form.endTime,req.query.form.status,req.query.form.executor,req.query.form.sender,req.query.form.id],(err,data)=>{
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
    var sql = 'delete from repairTask where id = ?'
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
exports.sendOrder = (req,res) =>{          //下发开始执行命令，工单状态改为进行中
    var sql = "update repairTask set status='进行中' where id=?"
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
exports.finishOrder = (req,res) =>{          //下发完成任务命令，工单状态改为待验收
    var sql = "update repairTask set status='待验收' where id=?"
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
exports.acceptOrder = (req,res) =>{          //确认验收，工单状态改为已验收
    var sql = "update repairTask set status='已验收' where id=?"
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
exports.rejectOrder = (req,res) =>{          //拒绝验收，工单状态改为进行中
    var sql = "update repairTask set status='进行中' where id=?"
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