import { createAppStore } from '@dumbdee/common-frontend';
export const store = createAppStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
