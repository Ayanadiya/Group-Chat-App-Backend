const Chat=require('../Model/chat');
const ArchivedChat=require('../Model/archivedchat');

exports.movetoArchivedChat= async (req,res,next) => {
    console.log('----------------------------------');
    const startTime = Date.now();
    console.log('Scheduler started at- ' + new Date());

    const t = await sequelize.transaction();
    try {
        const chats = await Chat.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.lte]: new Date(new Date() - 24 * 60 * 60 * 1000) // 1 day ago
                }
            },
            attributes: ['message', 'fileUrl', 'userId', 'groupId']
        });

        if (chats.length === 0) {
            console.log('No chats to archive.');
            return;
        }

        // Archive chats by bulk inserting into the ArchivedChat table
        await ArchivedChat.bulkCreate(chats.map(chat => ({
            message: chat.message,
            fileUrl: chat.fileUrl,
            userId: chat.userId,
            groupId: chat.groupId,
            createdAt: chat.createdAt
        })), { transaction: t });

        // Delete the archived chats from the Chat table
        await Chat.destroy({
            where: {
                id: chats.map(chat => chat.id)
            },
            transaction: t
        });

        await t.commit();
        console.log('SUCCESS: Updated Chats and ArchivedChats tables');
    } catch (error) {
        console.log('ERROR: Chats and ArchivedChats tables NOT updated');
        console.log(error);
        await t.rollback();
    }
    console.log('Scheduler stopped at- ' + new Date());
    console.log(`Time delay = ${Date.now() - startTime} ms`);
    console.log('----------------------------------');
}