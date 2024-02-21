
import { Core, Instance, Config, Target, File, CoreC, Listeners, User, LogMetrics } from '../../api/apiclient';
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'

const emptyCoreInstance = new Core();
const emptyConfigInstance = new Config();
const emptytargetObject: Target[] = [];
const emptyFilestore: File[] = [];
const emptyinstanceobject: Instance[] = [];
const emptyselectedtargets: number[] = [];
const emptyListener: Listeners[] = [];
const emptySelectedInstances = new Instance();
const emptyUsers: User[] = [];
const emptyStorage: LogMetrics = {_file_count:0,_byte_size:0,_record_count:0};

interface CoreState {
  coreObject: CoreC
  instanceObjects: Instance[]
  configObject: Config
  fstoreObject: File[]
  SelectedInstances: Instance
  selectedTargets: number[]
  targetObjects: Target[]
  listenerObjects: Listeners[]
  SelectedContent: number
  Users: User[]
  LogMet: LogMetrics
}

const initialState: CoreState = {
  coreObject: emptyCoreInstance,
  configObject: emptyConfigInstance,
  fstoreObject: emptyFilestore,
  instanceObjects: emptyinstanceobject,
  SelectedInstances: emptySelectedInstances,
  selectedTargets: emptyselectedtargets,
  targetObjects: emptytargetObject,
  listenerObjects: emptyListener,
  Users: emptyUsers,
  SelectedContent: -1,
  LogMet: emptyStorage
}

export const CoreSlice = createSlice({
  name: 'CoreSlice',
  initialState,
  reducers: {
    BuildStateManagement:
      (state, action: PayloadAction<{ core: CoreC, config: Config, fstore: File[], instances: Instance[], listeners: Listeners[], users: User[] }>) => {
        state.coreObject = action.payload.core
        state.configObject = action.payload.config
        state.fstoreObject = action.payload.fstore
        state.instanceObjects = action.payload.instances
        state.listenerObjects = action.payload.listeners
        state.Users = action.payload.users
      },
    SetListener:
      (state, action: PayloadAction<{ listenerid: Listeners[] }>) => {
        state.listenerObjects = action.payload.listenerid
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
      (state, action: PayloadAction<{ instance: any[] }>) => {
        state.instanceObjects = action.payload.instance;
      },
    SetConfiguration:
      (state, action: PayloadAction<{ configuration: Config }>) => {
        state.configObject = action.payload.configuration;
      },
    SetInstanceTargets:
      (state, action: PayloadAction<{ targets: any[] }>) => {
        state.targetObjects = action.payload.targets as unknown as Target[]
      },
    SetUsers:
      (state, action: PayloadAction<{ users: User[] }>) => {
        state.Users = action.payload.users
      },
    SetFileList:
      (state, action: PayloadAction<{ files: File[] }>) => {
        state.fstoreObject = action.payload.files
      },
    SetLogMet:
      (state, action: PayloadAction<{ logmet: LogMetrics }>) => {
        state.LogMet = action.payload.logmet
      }


  }

});

export default CoreSlice.reducer;

export const { SetCore,
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
  SetSelectedContent,
  SetListener,
  SetUsers,
  SetFileList,
  SetLogMet
} = CoreSlice.actions;
