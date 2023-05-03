import { configureStore, createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
  name: 'searches',
  initialState: [],
  reducers: {
    addSearch: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addSearch } = searchSlice.actions;

export default configureStore({
  reducer: {
    searches: searchSlice.reducer,
  },
});