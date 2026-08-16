import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { MessageService } from "./message.service.js";

const createMessage = asyncHandler(async (req, res) => {
    const { from, email, subject, message, type } = req.body;

    const newMessage = await MessageService.createMessage({ from, email, subject, message, type });

    return res.status(201).json(
        new ApiResponse(201, newMessage, "Message sent successfully")
    );
});

const getAllMessages = asyncHandler(async (req, res) => {
    const messages = await MessageService.getAllMessages();
    return res.status(200).json(
        new ApiResponse(200, messages, "Messages fetched successfully")
    );
});

const getMessageById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const message = await MessageService.getMessageById(id);

    return res.status(200).json(
        new ApiResponse(200, message, "Message fetched successfully")
    );
});

const markMessageAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const message = await MessageService.markMessageAsRead(id);

    return res.status(200).json(
        new ApiResponse(200, message, "Message marked as read")
    );
});

const deleteMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await MessageService.deleteMessage(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Message deleted successfully")
    );
});

export {
    createMessage,
    getAllMessages,
    getMessageById,
    markMessageAsRead,
    deleteMessage
};
