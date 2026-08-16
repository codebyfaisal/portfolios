import { Subscriber } from "./subscriber.model.js";
import { ApiError } from "../../utils/ApiError.js";

const subscribe = async (email) => {
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
        if (!existingSubscriber.isSubscribed) {
            existingSubscriber.isSubscribed = true;
            await existingSubscriber.save();
            return { subscriber: existingSubscriber, message: "Welcome back! You have successfully resubscribed.", status: 200 };
        }
        throw new ApiError(409, "You are already subscribed to the newsletter.");
    }

    const subscriber = await Subscriber.create({ email });
    return { subscriber, message: "Successfully subscribed to the newsletter!", status: 201 };
};

const getSubscribers = async () => {
    return await Subscriber.find({}).sort({ createdAt: -1 });
};

const deleteSubscriber = async (id) => {
    const subscriber = await Subscriber.findByIdAndDelete(id);
    if (!subscriber) throw new ApiError(404, "Subscriber not found");
    return subscriber;
};

export const SubscriberService = {
    subscribe,
    getSubscribers,
    deleteSubscriber
};
