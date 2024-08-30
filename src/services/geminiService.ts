import axios from 'axios';

class GeminiService {
    static async extractMeasure(image: string, customerCode: string, measureDatetime: string, measureType: string) {
        try {
            const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=GEMINI_API_KEY', {
                image,
                customer_code: customerCode,
                measure_datetime: measureDatetime,
                measure_type: measureType
            });

            return response.data;
        } catch (error: any) {
            console.error('Error calling Gemini API:', error.response?.data || error.message || 'Unknown error');
            throw new Error(error.response?.data?.message || 'Failed to extract measure from Gemini API');
        }
    }
}

export default GeminiService;
