// Location-based Ayurvedic Services
export const locationService = {
  // Sample Ayurvedic stores database
  ayurvedicStores: {
    "New York": [
      { name: "Ayurveda NYC", address: "123 Broadway, NY 10001", phone: "+1-212-555-0123", rating: 4.5 },
      { name: "Himalayan Herbs", address: "456 5th Ave, NY 10018", phone: "+1-212-555-0456", rating: 4.2 },
      { name: "Vedic Wellness Center", address: "789 Park Ave, NY 10021", phone: "+1-212-555-0789", rating: 4.7 }
    ],
    "Los Angeles": [
      { name: "LA Ayurveda", address: "321 Sunset Blvd, LA 90028", phone: "+1-323-555-0321", rating: 4.3 },
      { name: "Golden State Herbs", address: "654 Hollywood Blvd, LA 90028", phone: "+1-323-555-0654", rating: 4.1 },
      { name: "Pacific Ayurveda", address: "987 Venice Beach, LA 90291", phone: "+1-310-555-0987", rating: 4.6 }
    ],
    "Mumbai": [
      { name: "Ayurved Bhavan", address: "Fort, Mumbai 400001", phone: "+91-22-2266-1234", rating: 4.8 },
      { name: "Himalaya Store", address: "Bandra West, Mumbai 400050", phone: "+91-22-2640-5678", rating: 4.4 },
      { name: "Patanjali Megastore", address: "Andheri East, Mumbai 400069", phone: "+91-22-2821-9012", rating: 4.2 }
    ],
    "Delhi": [
      { name: "Khari Baoli Herbs", address: "Chandni Chowk, Delhi 110006", phone: "+91-11-2396-1234", rating: 4.6 },
      { name: "Ayurvedic Plaza", address: "Connaught Place, Delhi 110001", phone: "+91-11-2341-5678", rating: 4.3 },
      { name: "Dabur Nature Care", address: "Karol Bagh, Delhi 110005", phone: "+91-11-2575-9012", rating: 4.5 }
    ],
    "London": [
      { name: "Ayurveda Pura", address: "72 Wimpole St, London W1G 8AX", phone: "+44-20-7224-3344", rating: 4.4 },
      { name: "Neal's Yard Remedies", address: "15 Neal's Yard, London WC2H 9DP", phone: "+44-20-7379-7222", rating: 4.2 },
      { name: "Pukka Herbs Store", address: "Unit 1, Chalford, Stroud GL6 8NT", phone: "+44-1453-896-000", rating: 4.6 }
    ]
  },

  // Regional herb availability
  regionalHerbs: {
    "tropical": ["Turmeric", "Ginger", "Neem", "Tulsi", "Amla", "Ashwagandha"],
    "temperate": ["Brahmi", "Ginger", "Tulsi", "Triphala", "Ashwagandha"],
    "arid": ["Neem", "Ashwagandha", "Ginger", "Turmeric"],
    "coastal": ["Turmeric", "Ginger", "Neem", "Brahmi", "Amla"],
    "mountain": ["Brahmi", "Ashwagandha", "Tulsi", "Triphala"]
  },

  // Climate-based remedy suggestions
  climateRemedies: {
    "hot": {
      suggestions: ["Cooling herbs like Amla, Brahmi, and Neem", "Coconut water with mint", "Aloe vera juice"],
      avoid: ["Heating spices like excessive ginger", "Heavy, oily foods"],
      tips: "Stay hydrated and prefer cooling foods during hot weather"
    },
    "cold": {
      suggestions: ["Warming herbs like Ginger, Cinnamon, and Ashwagandha", "Golden milk with turmeric", "Herbal teas"],
      avoid: ["Cold drinks and raw foods", "Excessive cooling herbs"],
      tips: "Keep warm and use heating spices to maintain body temperature"
    },
    "humid": {
      suggestions: ["Digestive herbs like Ginger and Hing", "Light, easily digestible foods", "Triphala for detox"],
      avoid: ["Heavy, oily foods", "Excessive dairy products"],
      tips: "Focus on light meals and digestive support during humid weather"
    },
    "dry": {
      suggestions: ["Moisturizing herbs like Amla and Brahmi", "Ghee and healthy oils", "Hydrating foods"],
      avoid: ["Excessive dry, rough foods", "Too much caffeine"],
      tips: "Increase hydration and use nourishing oils for skin and body"
    }
  },

  // Get user location
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use a free geocoding service to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            resolve({
              latitude,
              longitude,
              city: data.city || data.locality || "Unknown",
              country: data.countryName || "Unknown",
              region: data.principalSubdivision || "Unknown"
            });
          } catch (error) {
            resolve({ latitude, longitude, city: "Unknown", country: "Unknown" });
          }
        },
        (error) => reject(error),
        { timeout: 10000 }
      );
    });
  },

  // Find nearby stores
  findNearbyStores(city) {
    const cityKey = Object.keys(this.ayurvedicStores).find(key => 
      key.toLowerCase().includes(city.toLowerCase()) || 
      city.toLowerCase().includes(key.toLowerCase())
    );
    
    return this.ayurvedicStores[cityKey] || [];
  },

  // Get local herb availability
  getLocalHerbs(climateType) {
    return this.regionalHerbs[climateType] || this.regionalHerbs["temperate"];
  },

  // Determine climate type based on location
  determineClimateType(city, country) {
    const tropicalRegions = ["mumbai", "chennai", "bangalore", "miami", "singapore", "bangkok"];
    const aridRegions = ["delhi", "phoenix", "las vegas", "dubai", "cairo"];
    const coastalRegions = ["mumbai", "chennai", "miami", "san francisco", "sydney"];
    const mountainRegions = ["denver", "shimla", "kathmandu", "zurich"];
    
    const location = `${city} ${country}`.toLowerCase();
    
    if (tropicalRegions.some(region => location.includes(region))) return "tropical";
    if (aridRegions.some(region => location.includes(region))) return "arid";
    if (coastalRegions.some(region => location.includes(region))) return "coastal";
    if (mountainRegions.some(region => location.includes(region))) return "mountain";
    
    return "temperate";
  },

  // Get climate-based suggestions
  getClimateSuggestions(weather = "temperate") {
    return this.climateRemedies[weather] || this.climateRemedies["temperate"];
  },

  // Get weather-based recommendations
  async getWeatherRecommendations(city) {
    try {
      // Simulate weather data (in real app, use weather API)
      const mockWeather = {
        temperature: Math.floor(Math.random() * 40) + 10, // 10-50°C
        humidity: Math.floor(Math.random() * 100),
        condition: ["sunny", "rainy", "cloudy", "hot", "cold"][Math.floor(Math.random() * 5)]
      };

      let weatherType = "temperate";
      if (mockWeather.temperature > 30) weatherType = "hot";
      else if (mockWeather.temperature < 15) weatherType = "cold";
      else if (mockWeather.humidity > 70) weatherType = "humid";
      else if (mockWeather.humidity < 30) weatherType = "dry";

      return {
        weather: mockWeather,
        recommendations: this.getClimateSuggestions(weatherType)
      };
    } catch (error) {
      return {
        weather: { condition: "unknown" },
        recommendations: this.getClimateSuggestions("temperate")
      };
    }
  }
};

// Location query detection
export const isLocationQuery = (query) => {
  const locationKeywords = [
    "near me", "nearby", "find stores", "ayurvedic stores", "herb shops",
    "where to buy", "local availability", "in my area", "around me",
    "climate", "weather", "seasonal", "regional", "local herbs"
  ];
  
  return locationKeywords.some(keyword => 
    query.toLowerCase().includes(keyword)
  );
};

// Process location queries
export const processLocationQuery = async (query) => {
  try {
    let location;
    try {
      location = await locationService.getUserLocation();
    } catch (error) {
      // Fallback to default location for demo
      console.log('Using fallback location');
      location = {
        city: "New York",
        country: "United States",
        latitude: 40.7128,
        longitude: -74.0060
      };
    }
    
    const stores = locationService.findNearbyStores(location.city);
    const climateType = locationService.determineClimateType(location.city, location.country);
    const localHerbs = locationService.getLocalHerbs(climateType);
    const weather = await locationService.getWeatherRecommendations(location.city);

    return {
      type: "location",
      data: {
        location,
        stores,
        localHerbs,
        climate: climateType,
        weather: weather.weather,
        recommendations: weather.recommendations
      }
    };
  } catch (error) {
    console.error('Location processing error:', error);
    return {
      type: "location_error",
      message: "Unable to access location. Please enable location services or manually specify your city."
    };
  }
};