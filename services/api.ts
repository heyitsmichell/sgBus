export const fetchBusStops = async (skip: number) => {
    try {
      const response = await fetch(`https://sgbus-server.onrender.com/api/bus-stops?$skip=${skip}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error fetching bus stops:', error);
      throw error;
    }
  };
  
  export const fetchBusArrivalData = async (busStopCode: string) => {
    try {
      const response = await fetch(`https://sgbus-server.onrender.com/api/bus-arrival?BusStopCode=${busStopCode}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error fetching bus arrival data:', error);
      throw error;
    }
  };
  