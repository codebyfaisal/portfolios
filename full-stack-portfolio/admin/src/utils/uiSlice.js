export const createUiSlice = (set, get) => ({
    isSidebarOpen: false,
    openSidebar: () => set({ isSidebarOpen: true }),
    closeSidebar: () => set({ isSidebarOpen: false }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    pageHeader: { title: "", description: "", actions: null },
    setPageHeader: (data) => set({ pageHeader: data }),
});
