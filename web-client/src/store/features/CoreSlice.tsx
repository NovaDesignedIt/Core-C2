
import { Core, Instance, CoreInterface, Config } from '../../api/apiclient';
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'

const emptyCoreInstance = new Core();

interface CoreState {
    coreObject : Core
}

const initialState : CoreState  = {
    coreObject: emptyCoreInstance
}

export const CoreSlice = createSlice({
  name: 'CoreSlice',
  initialState,
  reducers: {
    InsertInstance:
    ( state, action : PayloadAction <{ instance : Instance }> ) => {
       state.coreObject.addInstance(action.payload.instance)
    },
    DeleteInstance:
    ( state, action : PayloadAction <{ _id : number }> ) => {
       state.coreObject.deleteInstance(action.payload._id)
    },
    SetCore:
    ( state, action : PayloadAction <{ coreObject : Core }> ) => {
      state.coreObject = action.payload.coreObject 
   }
  
  }
});


export default CoreSlice.reducer;
export const { SetCore,InsertInstance,DeleteInstance } = CoreSlice.actions;
