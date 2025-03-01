  export type Field = {
    id: string;
    color: string;
    area: number;
    label: string;
    isUpdating?: boolean;
    coordinates: number[][][];
    authorId?: string;
    categories?: Category[];
  };

  export type Category = {
    id?: string;
    type: string;
  };

  export type User = {
    id: string;
    name: string;
    email: string;
  }



  export type WeatherApiResponse = {
    coord: {
      lat: number;
      lon: number;
    };
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    rain?: {
      "1h": number;
    };
    dt: number;
    name: string;
  };
  
  export type ForecastApiResponse = {
    list: Array<{
      dt: number;
      main: {
        temp_min: number;
        temp_max: number;
      };
      weather: Array<{
        main: string;
        description: string;
        icon: string;
      }>;
      pop: number; // Probability of precipitation
    }>;
  };

  export type CurrentWeather = {
    temperature: string;
    humidity: string;
    windSpeed: string;
    forecast: string;
    rainfall: string;
    location: string;
    lastUpdated: string;
    icon: string;
  };
  
  export type ForecastDay = {
    date: string;
    day: string;
    high: string;
    low: string;
    forecast: string;
    rainChance: string;
    icon: string;
  };
  

  export type JobStatus = 'COMPLETED' | 'DUE' | 'ONGOING';

  export type Job = {
    id: string;
    title: string;
    description: string;
    status: JobStatus;
    startDate: Date;
    endDate: Date;
    location?: string | null;
    assignedToId?: string | null;
    assignedTo?: {
      id: string;
      name: string;
      email: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type JobFormData = {
    title: string;
    description: string;
    status: JobStatus;
    startDate: Date;
    endDate: Date;
    location?: string;
    assignedToId?: string;
  }