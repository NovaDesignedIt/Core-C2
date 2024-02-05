export const  adjustSizes = (allSizes:number[], minSize1:number, minSize2:number):number[] => {
    allSizes  = allSizes[0] < minSize1  ?  [minSize1,100-minSize1]  : allSizes
    allSizes  = allSizes[1] < minSize2  ?  [100-minSize2,minSize2]  : allSizes
 return allSizes;
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

  export function getStateLabel (state:number){
  var statusText = '';
  switch (state) {
    case 0:
      statusText = "Task";
      break;
    case 1:
      statusText = "Sleep";
      break;
    case 2:
      statusText = "dropped";
      break;
    case 3:
      statusText = "Listening";
      break;
    default:
      statusText = "awaiting";
  }

  return statusText;

}


export function returnStateColor(state: number) {
  let col: string = ''; // Use let instead of const

  switch (state) {
    case 0:
      col = "lightyellow";
      break; // Add break statement
    case 1:
      col = "cyan";
      break; // Add break statement
    case 2:
      col = "#888";
      break; // Add break statement
    case 3:
      col = "green";
      break; // Add break statement
    default:
      col = "#333";
  }

  return col;
}
