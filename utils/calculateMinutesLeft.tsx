export const calculateMinutesLeft = (arrivalTime: string): string => {
    const arrivalDate = new Date(arrivalTime);
  
    // Return 'NA' if the date is invalid
    if (isNaN(arrivalDate.getTime())) return 'NA';
  
    const diffMins = Math.round((arrivalDate.getTime() - Date.now()) / 60000);
  
    return diffMins <= 0 ? 'Arr' : String(diffMins);
  };
  