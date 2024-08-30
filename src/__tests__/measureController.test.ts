import { Request, Response } from 'express';
import { uploadMeasure } from '../controllers/measureController';
import GeminiService from '../services/geminiService';
import Measure from '../models/Measure';

jest.mock('../services/geminiService');
jest.mock('../models/Measure');

const mockExtractMeasure = GeminiService.extractMeasure as jest.Mock;
const mockCreateMeasure = Measure.create as jest.Mock;

describe('uploadMeasure Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and the measure data on success', async () => {
        mockExtractMeasure.mockResolvedValue({
            image_url: '',
            measure_value: 123,
            measure_uuid: 'uuid-123'
        });

        mockCreateMeasure.mockResolvedValue({
            image_url: '',
            measure_value: 123,
            measure_uuid: 'uuid-123',
        });

        const req = {
            body: {
                image: 'iVBORw0KGgoAAAANSUhEUgAA...',
                customer_code: 'customer123',
                measure_datetime: '2024-08-29T18:00:00Z',
                measure_type: 'WATER'
            }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await uploadMeasure(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            image_url: 'http://mockurl.com/image.jpg',
            measure_value: 123,
            measure_uuid: 'uuid-123'
        });
    });

});