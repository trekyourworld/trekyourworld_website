// Helper function to transform API data to match our component's expected format
export const transformApiTrek = (apiTrek) => {
    return {
        id: apiTrek.uuid,
        name: apiTrek.title,
        image: `https://images.unsplash.com/photo-1515876305430-f06edab8282a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80`, // Default image as API doesn't provide one
        location: apiTrek.location || "Unknown",
        difficulty: Array.isArray(apiTrek.difficulty) ? apiTrek.difficulty[0] : "Moderate",
        duration: apiTrek.duration ? `${apiTrek.duration} days` : "Unknown",
        rating: 4.5, // Default rating as API doesn't provide one
        price: apiTrek.cost ? parseInt(apiTrek.cost.replace(',', '')) : 999,
        description: `Trek to ${apiTrek.title} - Elevation: ${apiTrek.elevation || 'N/A'}`,
        elevation: apiTrek.elevation,
        organiser: apiTrek.org || "Unknown"
    };
};

