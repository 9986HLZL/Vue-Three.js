let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from inventory_record'
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
exports.createRecord = (req,res) =>{          //添加巡检记录
    var sql = 'insert into inventory_record (id,quantity,latestTime,executor,operate) values(?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.quantity,req.query.form.latestTime,req.query.form.executor,req.query.form.operate],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}