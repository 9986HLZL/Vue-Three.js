let db = require('../db/index')

exports.get = (req,res) => {
    var sql = 'insert into user values(?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.pass,req.query.form.role,req.query.form.phone,req.query.form.email],(err,data) =>{
        if(err){
            return res.send('错误：' + err.message)
        }
        res.send({
            status:200,
            message:'注册成功'
        })
    })
}