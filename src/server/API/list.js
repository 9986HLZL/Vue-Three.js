let db = require('../db/index')

exports.all = (req,res) =>{
    var sql = 'select * from list'
    db.query(sql,(err,data)=>{         //获取list表中全部数据
        if(err){
            return res.send('错误' + err.message)
        }
        res.send(data)
    })
}
exports.page = (req,res) =>{           //分页接口
    let pageNo = Number(req.body.pageNum) || 1;
    let pageCount = Number(req.body.pageSize) || 10;
    let pageSize = pageCount;
    let page = (pageNo - 1) * pageCount;
    var sql = `select * from list limit ${page},${pageSize}`;
    db.query(sql,(error,results,fields)=>{
        if(error){
          console.log(error);
          res.json({ err_code: 0, message: "获取分页数据失败"});
        }else{
            res.json({success_code: 200, message: '获取分页数据成功', data: {results,pageNo,pageSize}})
        }
      })
    
}
exports.get = (req,res) =>{            //通过查询数据
    var name="%"+req.query.searchKey+"%"                 //模糊查询
    var sql = 'select * from list where name like ?'     //?用于占位
    db.query(sql,[name],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send(data)
    })
    
}
exports.del = (req,res) =>{          //通过id删除数据
    var sql = 'delete from list where id = ?'
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
exports.add = (req,res) =>{          //向list表添加数据
    var sql = 'insert into list (id,name,nickName,age,sex,phone,address) values(?,?,?,?,?,?,?)'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.nickName,req.query.form.age,req.query.form.sex,req.query.form.phone,req.query.form.address],(err,data)=>{
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
    var sql = 'update list set id=?,name=?,nickName=?,age=?,sex=?,phone=?,address=? where id=?'
    db.query(sql,[req.query.form.id,req.query.form.name,req.query.form.nickName,req.query.form.age,req.query.form.sex,req.query.form.phone,req.query.form.address,req.query.form.id],(err,data)=>{
        if(err){
            return res.send('错误' + err.message)
        }
        res.send({
            status:200,
            message:'success'
        })
    })
}