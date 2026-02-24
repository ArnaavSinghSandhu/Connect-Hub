const prisma = require("../db");

exports.post_list_get = async (req,res,next) => {
    try{
        const posts = await prisma.post.findMany({
            include:{
                author:{
                    select:{username:true, id:true}
                }
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        res.render("index", { posts });
    }catch(err){
        next(err);
    }
};

exports.post_create_post = async (req,res,next) => {
    try{
        await prisma.post.create({
            data:{
                content:req.body.content,
                authorId: req.user.id,
            },
        });
        res.redirect("/posts");
    }catch(err){
        next(err);
    }
}
