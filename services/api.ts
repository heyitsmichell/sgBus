export const fetchBusStops = async (skip: number) => {
  const response = await fetch(`https://sgbus-server.onrender.com/api/bus-stops?$skip=${skip}`, {
      headers: {
          'Accept': 'application/json'
      }
  });
  if (!response.ok) {
      throw new Error('Network response was not ok.');
  }
  return response.json();
};

export const fetchBusArrivalData = async (busStopCode: string) => {
  const response = await fetch(`https://sgbus-server.onrender.com/api/bus-arrival?BusStopCode=${busStopCode}`, {
      headers: {
          'Accept': 'application/json'
      }
  });
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
};