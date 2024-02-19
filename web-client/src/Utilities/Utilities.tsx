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

export const themeText = {
  borderRadius: "3px",
  backgroundColor: "#333",
  "&:Hover,focus": {
      backgroundColor: "#555"
  },
  // OUTLINE
  "& .MuiOutlinedInput-root": {
      ":Hover,focus,selected,fieldset, &:not(:focus)": {
          "& > fieldset": { borderColor: "transparent", borderRadius: 0, },
      },
      "& > fieldset": { borderColor: "transparent", borderRadius: 0 },
      borderColor: "transparent", borderRadius: 0,
  },
  "& .root": { color: "#fff" },
  "& .MuiInputLabel-root": { display: 'none' },
  "& .MuiInput-root": { ":focused, selected": { color: '#fff' } },
  input: { color: '#fff' },
  inputProps: {
      style: { fontFamily: 'nunito', },
  },
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
}


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
  let statusText = 'error';
  console.log(state," STATE STATE")
  statusText = state === 0 || state === 'Task' ? "Task" : statusText
  statusText = state === 1 || state === 'Sleep' ? "Sleep" : statusText
  statusText = state === 2 || state === 'dropped' ? "Dropped" : statusText
  statusText = state === 3 || state === 'Listen' ? "Listen" : statusText
  statusText = state === -1 || state === 'Awaiting' ? "Awaiting" : statusText
  return statusText

}


export function returnStateColor(state: number | string ) {
  let StatusColor: string = '#444'; // Use let instead of const
  StatusColor = state === 0 || state === 'Task' ? "#ff625b" : StatusColor
  StatusColor = state === 1 || state === 'Sleep' ? "#669996" : StatusColor
  StatusColor = state === 2 || state === 'dropped' ? "#444" : StatusColor
  StatusColor = state === 3 || state === 'Listen' ? "green" : StatusColor
  StatusColor = state === -1 || state === 'awaiting' ? "#888" : StatusColor
  return StatusColor;
}
