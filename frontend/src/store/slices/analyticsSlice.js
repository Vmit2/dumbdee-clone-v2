import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pageViews: 0,
  events: [],
  userJourney: [],
  performance: {
    pageLoadTime: 0,
    apiResponseTime: 0,
  },
  errors: [],
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    trackPageView: (state, action) => {
      state.pageViews += 1;
      state.userJourney.push({
        type: 'page_view',
        page: action.payload.page,
        timestamp: Date.now(),
      });
    },
    trackEvent: (state, action) => {
      state.events.push({
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    trackError: (state, action) => {
      state.errors.push({
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    setPerformanceMetrics: (state, action) => {
      state.performance = { ...state.performance, ...action.payload };
    },
    clearAnalytics: (state) => {
      state.events = [];
      state.userJourney = [];
      state.errors = [];
      state.pageViews = 0;
    },
  },
});

export const {
  trackPageView,
  trackEvent,
  trackError,
  setPerformanceMetrics,
  clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
