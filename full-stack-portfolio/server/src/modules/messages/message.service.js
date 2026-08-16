import { Message } from "./message.model.js";
import { ApiError } from "../../utils/ApiError.js";

const createMessage = async (data) => {
    return await Message.create(data);
};

const getAllMessages = async () => {
    return await Message.find().sort({ date: -1 });
};

const getMessageById = async (id) => {
    const message = await Message.findById(id);
    if (!message) throw new ApiError(404, "Message not found");
    return message;
};

const markMessageAsRead = async (id) => {
    const message = await Message.findByIdAndUpdate(
        id,
        { $set: { status: 'read' } },
        { new: true }
    );
    if (!message) throw new ApiError(404, "Message not found");
    return message;
};

const deleteMessage = async (id) => {
    const message = await Message.findByIdAndDelete(id);
    if (!message) throw new ApiError(404, "Message not found");
    return message;
};

const countMessages = async () => {
    return await Message.countDocuments();
};

const getRecentMessages = async (limit = 5) => {
    return await Message.find().sort({ createdAt: -1 }).limit(limit);
};

export const MessageService = {
    createMessage,
    getAllMessages,
    getMessageById,
    markMessageAsRead,
    deleteMessage,
    countMessages,
    getRecentMessages
};
