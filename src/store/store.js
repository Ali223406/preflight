import { configureStore } from '@reduxjs/toolkit';

import checklistReducer from './checklistsSlice';

const store = configureStore({
    reducer: {
        checklists: checklistReducer,
    },
});

export default store;