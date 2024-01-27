export const  adjustSizes = (allSizes:number[], minSize1:number, minSize2:number):number[] => {
    allSizes  = allSizes[0] < minSize1  ?  [minSize1,100-minSize1]  : allSizes
    allSizes  = allSizes[1] < minSize2  ?  [100-minSize2,minSize2]  : allSizes
 return allSizes;
}