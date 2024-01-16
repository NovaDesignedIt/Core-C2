import  { CoreSlice } from  './features/CoreSlice';

import  { configureStore } from '@reduxjs/toolkit' ;

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';



export const store = configureStore({
    reducer: {
        core: CoreSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});


export const useAppDispatch:()=> typeof store.dispatch=useDispatch;
export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector;