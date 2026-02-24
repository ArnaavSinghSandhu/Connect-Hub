const prisma = require('../db');

exports.followUser = async (req,res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUserId = req.user.id;

    try{
        await prisma.follow.create({
            data:{
                followerId:currentUserId,
                followingId: targetUserId,
            },
        });
        res.redirect(`/users/${targetUserId}`);
    }catch(err){
        res.status(400).send("Already following the user");
    }
};

exports.unfollow = async (req,res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUserId = req.user.id;

    try{
        const deleteUser = await prisma.follow.delete({
            where: {
                followerId_followingId:{
                followerId:currentUserId,
                followingId: targetUserId,
            },
        },
        });
        res.redirect(`/users/${targetUserId}`);
    }catch(err){
        res.status(400).send("Already Removed the Follower from the Following List");
    }
}

exports.index = async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      NOT: { id: req.user.id } 
    },
    include: {
      followedBy: {
        where: { followerId: req.user.id } 
      }
    }
  });
  res.render('index', { users });
};

exports.show = async (req,res) => {
    const profileUser = await prisma.user.findUnique({
        where: {id : parseInt(req.params.id)},
        include: {
            posts:{
                orderBy: {createdAt : 'desc'},
                include: {author: true,likes: true,comments: true}
            },
            _count:{
                select:{followedBy:true,following:true}
            }
        }
    });
    if(!profileUser) return res.status(404).send("User not found");
    res.render("users/show",{ profileUser });
};

