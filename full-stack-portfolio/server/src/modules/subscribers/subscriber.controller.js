import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { SubscriberService } from "./subscriber.service.js";

const subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const { subscriber, message, status } = await SubscriberService.subscribe(email);

    return res.status(status).json(
        new ApiResponse(status, subscriber, message)
    );
});

const getSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await SubscriberService.getSubscribers();
    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

const deleteSubscriber = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subscriber = await SubscriberService.deleteSubscriber(id);

    return res.status(200).json(
        new ApiResponse(200, { id: subscriber._id }, "Subscriber removed successfully")
    );
});

export { subscribe, getSubscribers, deleteSubscriber };
