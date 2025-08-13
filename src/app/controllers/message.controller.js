import { ValidationError } from "../../lib/error-definitions.js";
import { Validator } from "../../lib/validator.js";
import { sendMessageRequest } from "../requests/send.message.request.js";
import { Message } from "../schema/message.schema.js";

export const getMessages = async (req, res) => {
    const {userId} = req.params;
    const messages = await Message.find({
        $or: [{sender: userId}, {receiver: userId}]
    })
    .populate("sender receiver", "username")
    .sort({timestamp: 1});
    res.json(messages);
}

export const sendMessage = async (req, res, next) => {
    try {
        const validator = new Validator();
        const { error, value } = validator.validate(sendMessageRequest, req.body);

        if (error) {
            throw new ValidationError(
                "The request failed with the following errors",
                error
            );
        }

        const message = await Message.create({
            sender: value.sender,
            receiver: value.receiver,
            content: value.content
        });

        res.status(201).json({
            message: 'sent',
            data: message
        });
    } catch (err) {
        next(err); // Forward to error-handling middleware
    }
};

