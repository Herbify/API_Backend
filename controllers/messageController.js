class MessageController {
    static async getAllConversations(req, res) {
        try {
            res.status(200).json({
                message: "Successfully get all conversations"
            });
        } catch (error) {
            res.status(500).json({
                message: "[Error]:getProductList",
                error: error.message,
            });
        }
    }

    static async getUserConversation(req, res) {
        try {
            const {
                userId,
                doctorId,
                status
            } = req.query;
            const data = [];

            res.status(200).json({
                message: `Successfully get user conversations`,
                detail: {
                    status,
                    userId,
                    doctorId,
                },
                data
            })
        } catch (error) {
            res.status(500).json({
                message: "[Error]:getUserConversation",
                error: error.message,
            });
        }
    }

    static async sendMessage(req, res) {
        try {
            const {
                sender,
                recipient,
                message,
                fromUser
            } = req.body;

            const data = await prisma.message.create({
                data: {
                    sender: Number(sender),
                    recipient: Number(recipient),
                    content: message,
                    fromUser,
                },
            });

            res.status(201).json({
                message: `Successfully send a message`,
                data,
            });
        } catch (error) {
            res.status(500).json({
                message: "[Error]:sendMessage",
                error: error.message,
            });
        }
    }
}

module.exports = MessageController;