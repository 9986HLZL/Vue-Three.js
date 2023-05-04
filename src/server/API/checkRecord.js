let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from checkRecord'
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
    var sql = 'insert into checkRecord (id,workshop,checkTime,executor,check_Point,pathId,checkSequence) values(?,?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.workshop,req.query.form.checkTime,req.query.form.executor,req.query.form.check_Point,req.query.form.pathId,req.query.form.checkSequence],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}