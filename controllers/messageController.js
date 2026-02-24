const prisma = require("../db");

exports.getChatHistory = async (req ,res) => {
    try{
        const {userId} =req.params;
        const currentUserId = req.user.id;

        const ChatHistory = await prisma.message.findMany({
            where:{
                OR:[
                    {
                        senderId: parseInt(currentUserId),
                        receiverId: parseInt(userId),
                    },
                    {
                        senderId: parseInt(userId),
                        receiverId: parseInt(currentUserId),
                    },
                ],
            },
            orderBy:{
                createdAt: "asc",
            },
            include:{
                sender:{
                    select:{username:true}
                }
            }
        });
        res.json(ChatHistory);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Could Not fetch"});
    }
}