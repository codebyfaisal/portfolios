import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

/**
 * Custom hook to handle copying text to clipboard with toast notification and temporary state.
 * @returns {Object} { copiedId, copy }
 */
const useCopy = () => {
    const [copiedId, setCopiedId] = useState(null);

    const copy = useCallback((text, id = null, message = "Link copied to clipboard!") => {
        if (!text) {
            toast.error("Nothing to copy!");
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success(message);
                if (id) {
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2000);
                }
            })
            .catch(() => {
                toast.error("Failed to copy");
            });
    }, []);

    return { copiedId, copy };
};

export default useCopy;
