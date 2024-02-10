export const  adjustSizes = (allSizes:number[], minSize1:number, minSize2:number):number[] => {
    allSizes  = allSizes[0] < minSize1  ?  [minSize1,100-minSize1]  : allSizes
    allSizes  = allSizes[1] < minSize2  ?  [100-minSize2,minSize2]  : allSizes
 return allSizes;
}

export function generateRandomNumber() {
  // Generate a random number between 1 and 10
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  return randomNumber;
};

export const themeTextBlack = {
    height: "250px",
    color: "#fff",
    backgroundColor: "#000",
  "&:Hover,focus": {
    backgroundColor: "#000"
  },
  // OUTLINE
  "& .MuiOutlinedInput-root": {
    ":Hover,focus,selected,fieldset, &:not(:focus)": {
      "& > fieldset": { borderColor: "transparent", borderRadius: 0, },
    },
    "& > fieldset": { borderColor: "transparent", borderRadius: 0 },
    borderColor: "transparent", borderRadius: 0,
  }, "&.MuiTextField-root": { width: "100%" },
  "& .root": { color: "#fff" },
  "& .MuiInputLabel-root": { display: 'none' },
  "& .MuiInput-root": { ":focused, selected": { color: '#fff' } },
  input: { color: '#fff' },
}

export function getStateLabel(state: number | string) {
  let statusText = 'awaiting';
  statusText = state === 0 || state === 'Task' ? "Task" : statusText
  statusText = state === 1 || state === 'Sleep' ? "Sleep" : statusText
  statusText = state === 2 || state === 'dropped' ? "dropped" : statusText
  statusText = state === 3 || state === 'Listen' ? "Listen" : statusText
  return statusText

}


export function returnStateColor(state: number | string ) {
  let StatusColor: string = '#333'; // Use let instead of const
  StatusColor = state === 0 || state === 'Task' ? "#ff625b" : StatusColor
  StatusColor = state === 1 || state === 'Sleep' ? "cyan" : StatusColor
  StatusColor = state === 2 || state === 'dropped' ? "#888" : StatusColor
  StatusColor = state === 3 || state === 'Listen' ? "green" : StatusColor
  return StatusColor;
}
