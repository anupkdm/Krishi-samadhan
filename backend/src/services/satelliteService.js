exports.getSatelliteData = async (lat, lon) => {
    try {
        // Mocking demonstration satellite data
        return {
            ndvi: 0.65, // 0-1 range
            ndviInterpretation: 'Healthy vegetation density',
            landCover: 'Cropland',
            cropStress: 'Low',
            vegetationHealth: 'Good',
            moistureIndex: 0.42,
            changeDetection: '+5% vegetation cover compared to last month',
            source: 'Demonstration Data (Sentinel-2 compatible format)',
            status: 'Demonstration',
            disclaimer: 'This is a demonstration analysis. Connect real Sentinel Hub API for production use.'
        };
    } catch (error) {
        console.error('Satellite service error:', error);
        throw new Error('Failed to retrieve satellite data');
    }
};
