import dotenv from 'dotenv';
dotenv.config();
const API_KEY = process.env.API_KEY;
console.log(API_KEY);

export const fetchBusStops = async (skip: number) => {
    const response = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${skip}`, {
      headers: {
        'AccountKey': 'API_KEY',
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
        'AccountKey': 'API_KEY',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  