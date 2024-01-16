
import { Core, Instance, CoreInterface, Config, Target, File, CoreC, getallinstance } from '../../api/apiclient';
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'

const emptyCoreInstance = new CoreC();
const emptyConfigInstance = new Config();
const emptytargetObject: Target[] = []
const emptyFilestore: File[] = []
const emptyinstanceobject: Instance[] = []

interface CoreState {
  coreObject: CoreC
  instanceObjects: Instance[]
  configObject: Config
  fstoreObject: File[]
}

const initialState: CoreState = {
  coreObject: emptyCoreInstance,
  configObject: emptyConfigInstance,
  fstoreObject: emptyFilestore,
  instanceObjects: emptyinstanceobject
}

export const CoreSlice = createSlice({
  name: 'CoreSlice',
  initialState,
  reducers: {
    BuildStateManagement:
      (state, action: PayloadAction<{ core: CoreC, config: Config, fstore: File[], instances: Instance[] }>) => {
        state.coreObject = action.payload.core
        state.configObject = action.payload.config
        state.fstoreObject = action.payload.fstore
        state.instanceObjects = action.payload.instances
      },
    InsertInstance:
      (state, action: PayloadAction<{ instance: Instance }>) => {
        state.instanceObjects.push(action.payload.instance);
      },
    DeleteInstance:
      (state, action: PayloadAction<{ _id: number }>) => {
        state.instanceObjects = state.instanceObjects.filter(i => i._id !== action.payload._id);
      },
    SetCore:
      (state, action: PayloadAction<{ coreObject: Core }>) => {
        state.coreObject = action.payload.coreObject;
      },
    SetInstance:
      (state, action: PayloadAction<{ instance: Instance[] }>) => {
        state.instanceObjects = action.payload.instance;
      },
    SetConfiguration:
      (state, action: PayloadAction<{ configuration: Config }>) => {
        state.configObject = action.payload.configuration;
      },
  }

});

export default CoreSlice.reducer;
export const { SetCore, InsertInstance, DeleteInstance, BuildStateManagement, SetConfiguration, SetInstance } = CoreSlice.actions;
