import { create } from 'zustand';

import { createAuthSlice } from "@/features/auth/authSlice";
import { createServiceSlice } from "@/features/services/serviceSlice";
import { createPlanSlice } from "@/features/plans/planSlice";
import { createProjectSlice } from "@/features/projects/projectSlice";
import { createTestimonialSlice } from "@/features/testimonials/testimonialSlice";
import { createMessageSlice } from "@/features/messages/messageSlice";
import { createFileSlice } from "@/features/files/fileSlice";
import { createStatSlice } from "@/features/overview/statSlice";
import { createConfigSlice } from "@/features/configuration/configSlice";
import { createBlogSlice } from "@/features/blogs/blogSlice";
import { createJobSlice } from "@/features/jobs/jobSlice";
import { createFormSlice } from "@/features/forms/formSlice";
import { createUiSlice } from "@/utils/uiSlice";

const useDashboardStore = create((set, get, ...a) => ({
    isLoading: false,
    error: null,

    ...createAuthSlice(set, get, ...a),
    ...createServiceSlice(set, get, ...a),
    ...createPlanSlice(set, get, ...a),
    ...createProjectSlice(set, get, ...a),
    ...createTestimonialSlice(set, get, ...a),
    ...createMessageSlice(set, get, ...a),
    ...createFileSlice(set, get, ...a),
    ...createStatSlice(set, get),
    ...createConfigSlice(set, get),
    ...createBlogSlice(set, get),
    ...createJobSlice(set, get),
    ...createFormSlice(set, get),
    ...createUiSlice(set, get),
}));

export default useDashboardStore;
