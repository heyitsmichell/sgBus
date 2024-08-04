export const fetchBusStops = async (skip: number) => {
    const response = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${skip}`, {
      headers: {
        'AccountKey': '************************',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json();
  };
  
  export const fetchBusArrivalData = async (busStopCode: string) => {
    const response = await fetch(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`, {
      headers: {
        'AccountKey': '************************',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  