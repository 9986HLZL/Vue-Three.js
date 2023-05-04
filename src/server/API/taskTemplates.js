let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'select * from taskTemplates'
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
exports.add = (req,res) =>{          //添加工单模板
    var sql = 'insert into taskTemplates (name,description,fault,workType) values(?,?,?,?)'
    db.query(sql,[req.query.form.name,req.query.form.description,req.query.form.fault,req.query.form.workType],(err,data)=>{
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
exports.update = (req,res) =>{          //通过name更新数据
    var sql = 'update taskTemplates set name=?,description=?,fault=?,workType=? where name=?'
    db.query(sql,[req.query.form.name,req.query.form.description,req.query.form.fault,req.query.form.workType,req.query.form.name],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}
exports.del = (req,res) =>{          //通过name删除数据
    var sql = 'delete from taskTemplates where name = ?'
    db.query(sql,[req.query.name],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'删除成功'
        })
    })
}