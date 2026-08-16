import messagesService from './messages.service';
import { getErrorMessage } from "@/store/utils";

export const createMessageSlice = (set, get) => ({
    messages: null,
    messagePromise: null,

    fetchMessages: async () => {
        const { messages, messagePromise } = get();

        if (messages !== null) {
            if (messagePromise) return messagePromise;
            const resolved = Promise.resolve(messages);
            set({ messagePromise: resolved });
            return resolved;
        }

        if (messagePromise) return messagePromise;

        set({ isLoading: true });
        try {
            const promise = messagesService.getMessages().then((data) => {
                const safeData = data || [];
                set({
                    messages: safeData,
                    messagePromise: Promise.resolve(safeData),
                    isLoading: false
                });
                return safeData;
            });

            set({ messagePromise: promise });
            return promise;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    markMessageRead: async (id) => {
        try {
            const updatedMessage = await messagesService.markMessageRead(id);
            set((state) => {
                const newMessages = state.messages.map(m => m._id === id ? updatedMessage : m);
                return {
                    messages: newMessages,
                    messagePromise: Promise.resolve(newMessages)
                };
            });
        } catch (error) {
            console.error("Failed to mark message as read:", error);
        }
    },

    deleteMessage: async (id) => {
        set({ isLoading: true });
        try {
            await messagesService.deleteMessage(id);
            set((state) => {
                const newMessages = state.messages.filter(m => m._id !== id);
                return {
                    messages: newMessages,
                    messagePromise: Promise.resolve(newMessages),
                    isLoading: false
                };
            });
        } catch (error) {
            set({ isLoading: false });
            throw new Error(getErrorMessage(error));
        }
    },
    resetMessageState: () => {
        set({ messages: null, isLoading: true, messagePromise: null });
    },
});
