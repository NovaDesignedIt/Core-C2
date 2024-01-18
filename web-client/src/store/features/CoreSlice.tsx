
import { Core, Instance, Config, Target, File, CoreC,Listeners} from '../../api/apiclient';
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'

const emptyCoreInstance = new Core();
const emptyConfigInstance = new Config();
const emptytargetObject: Target[] = [];
const emptyFilestore: File[] = [];
const emptyinstanceobject: Instance[] = [];
const emptyselectedtargets: number[] = [];
const emptyListener: Listeners[] = [];
const emptySelectedInstances = new Instance();

interface CoreState {
  coreObject: CoreC
  instanceObjects: Instance[]
  configObject: Config
  fstoreObject: File[]
  SelectedInstances:Instance
  selectedTargets: number[]
  targetObjects: Target[]
  listenerObjects: Listeners[]
  SelectedContent:number
}

const initialState: CoreState = {
  coreObject: emptyCoreInstance,
  configObject: emptyConfigInstance,
  fstoreObject: emptyFilestore,
  instanceObjects: emptyinstanceobject,
  SelectedInstances:emptySelectedInstances,
  selectedTargets: emptyselectedtargets,
  targetObjects: emptytargetObject,
  listenerObjects:emptyListener,
  SelectedContent: -1,  
}

export const CoreSlice = createSlice({
  name: 'CoreSlice',
  initialState,
  reducers: {
    BuildStateManagement:
      (state, action: PayloadAction<{ core: CoreC, config: Config, fstore: File[], instances: Instance[], listeners:Listeners[] }>) => {
        state.coreObject = action.payload.core
        state.configObject = action.payload.config
        state.fstoreObject = action.payload.fstore
        state.instanceObjects = action.payload.instances
        state.listenerObjects = action.payload.listeners
      },
      DeleteListener:
      (state, action: PayloadAction<{ listenerid: number }>) => {
        state.listenerObjects = state.listenerObjects.filter(i => i._id !== action.payload.listenerid);
      },
      addlisteners:
      (state, action: PayloadAction<{ listener: Listeners }>) => {
        state.listenerObjects.push(action.payload.listener);
      },
      SetSelectedContent:
      (state, action: PayloadAction<{ content: number }>) => {
        state.SelectedContent = action.payload.content;
      },
    SetSelectedInstance:
      (state, action: PayloadAction<{ instance: Instance }>) => {
        state.SelectedInstances = action.payload.instance;
      },
    SetSelectedTargets:
      (state, action: PayloadAction<{ target_ids: number[] }>) => {
        state.selectedTargets = action.payload.target_ids;
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
    SetInstanceTargets:
    (state,action:PayloadAction<{instance:any[]}>) =>{
      state.targetObjects = action.payload.instance as unknown as Target[]
    },

  }

});

export default CoreSlice.reducer;

export const { 	SetCore,
  DeleteListener,
  addlisteners,
  SetInstanceTargets,
  InsertInstance,
  DeleteInstance,
  BuildStateManagement,
  SetConfiguration,
  SetInstance,
  SetSelectedTargets,
  SetSelectedInstance,
  SetSelectedContent 
} = CoreSlice.actions;
