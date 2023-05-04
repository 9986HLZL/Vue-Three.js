let db = require('../db/index')

exports.getLevel = (req,res) => {
    var sql = 'select * from ceshi'
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
exports.addProdution = (req,res) =>{          //向备品备件添加数据
    var sql = 'insert into productiondata (pressure,temperature) values(?,?)'
    db.query(sql,[req.query.pressure,req.query.temperature],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.getProdution = (req,res) => {
    var sql = 'select * from productiondata'
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
exports.working = (req,res) => {
    var sql = "select * from repairTask where workshop=? and status ='进行中'"
    db.query(sql,[req.query.workshop],(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.acceptable = (req,res) => {
    var sql = "select * from repairTask where workshop=? and status ='待验收'"
    db.query(sql,[req.query.workshop],(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.checkTask = (req,res) => {           //当前工单的巡检点
    var sql = "select workshop,id from checkTask where status ='进行中'"
    db.query(sql,(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        if(data.length>0){
            res.json({status:200,message:'success',data:data})
        }else{
            res.send({
                status:202,
                message:'获取数据失败'
            })
        }
    })
}
exports.getPosition = (req,res) => {           //当前工单的巡检点
    var sql = "select x,y,z from pointPosition where workshop =?"
    db.query(sql,[req.query.workshop],(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send(data)
    })
}
exports.changeTask = (req,res) => {           //获得出入库任务
    var sql = "select * from inventoryrecords where status ='进行中'"
    db.query(sql,(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        if(data.length>0){
            res.json({status:200,message:'success',data:data})
        }else{
            res.send({
                status:202,
                message:'获取数据失败'
            })
        }
    })
}
exports.finishChange = (req,res) =>{          //完成任务命令
    var sql = "update inventoryrecords set status='已完成' where id=?"
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
exports.updateQuantity = (req,res) =>{          //更新库存数量
    var sql = "update spareparts set quantity=quantity+? where id=?"
    db.query(sql,[req.query.quantity,req.query.id],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.updateOil = (req,res) =>{          //更新库存数量
    var sql = "update luboil set quantity=quantity+? where id=?"
    db.query(sql,[req.query.quantity,req.query.id],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}