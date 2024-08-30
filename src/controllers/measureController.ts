import { Request, Response } from 'express';
import GeminiService from '../services/geminiService';
import Measure from '../models/Measure';
import { validateUploadRequest, validateConfirmRequest } from '../utils/validateRequest';

export const uploadMeasure = async (req: Request, res: Response) => {
    try {
        console.log('Received request:', req.body);
        const { error } = validateUploadRequest(req.body);

        if (error) {
            const errorMessage = error.details?.map(detail => detail.message).join(', ') || 'Validation error';
            console.log('Validation error:', errorMessage);
            return res.status(400).json({ error_code: "INVALID_DATA", error_description: errorMessage });
        }

        const { image, customer_code, measure_datetime, measure_type } = req.body;

        console.log('Validating existing measure...');
        const existingMeasure = await Measure.findOne({
            where: {
                customer_code,
                measure_type,
                measure_datetime: {
                    $gte: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth(), 1)
                }
            }
        });

        if (existingMeasure) {
            console.log('Measure already exists:', existingMeasure);
            return res.status(409).json({ error_code: "DOUBLE_REPORT", error_description: "Leitura do mês já realizada" });
        }

        console.log('Calling GeminiService...');
        const measureResult = await GeminiService.extractMeasure(image, customer_code, measure_datetime, measure_type);

        console.log('MeasureResult from GeminiService:', measureResult);
        const newMeasure = await Measure.create({
            customer_code,
            measure_datetime,
            measure_type,
            image_url: measureResult.image_url,
            measure_value: measureResult.measure_value,
            measure_uuid: measureResult.measure_uuid,
            has_confirmed: false
        });

        res.status(200).json({
            image_url: newMeasure.image_url,
            measure_value: newMeasure.measure_value,
            measure_uuid: newMeasure.measure_uuid
        });

    } catch (error: any) {
        console.error('Error uploading measure:', error.message || error);
        res.status(500).json({ error_code: "SERVER_ERROR", error_description: error.message || "Ocorreu um erro interno" });
    }
};

export const confirmMeasure = async (req: Request, res: Response) => {
    try {
        const { error } = validateConfirmRequest(req.body);
        if (error) {
            const errorMessage = error.details?.map(detail => detail.message).join(', ') || 'Validation error';
            return res.status(400).json({ error_code: "INVALID_DATA", error_description: errorMessage });
        }

        const { measure_uuid, confirmed_value } = req.body;

        const measure = await Measure.findOne({ where: { measure_uuid } });

        if (!measure) {
            return res.status(404).json({ error_code: "MEASURE_NOT_FOUND", error_description: "Leitura não encontrada" });
        }

        if (measure.has_confirmed) {
            return res.status(409).json({ error_code: "CONFIRMATION_DUPLICATE", error_description: "Leitura do mês já realizada" });
        }

        measure.measure_value = confirmed_value;
        measure.has_confirmed = true;
        await measure.save();

        res.status(200).json({ success: true });

    } catch (error) {
        res.status(500).json({ error_code: "SERVER_ERROR", error_description: "Ocorreu um erro interno" });
    }
};

export const listMeasures = async (req: Request, res: Response) => {
    try {
        const { customer_code } = req.params;
        const { measure_type } = req.query;

        let whereClause: any = { customer_code };

        if (measure_type) {
            if (['WATER', 'GAS'].includes(measure_type.toString().toUpperCase())) {
                whereClause.measure_type = measure_type.toString().toUpperCase();
            } else {
                return res.status(400).json({ error_code: "INVALID_TYPE", error_description: "Tipo de medição não permitida" });
            }
        }

        const measures = await Measure.findAll({ where: whereClause });

        if (measures.length === 0) {
            return res.status(404).json({ error_code: "MEASURES_NOT_FOUND", error_description: "Nenhuma leitura encontrada" });
        }

        res.status(200).json({
            customer_code,
            measures: measures.map(measure => ({
                measure_uuid: measure.measure_uuid,
                measure_datetime: measure.measure_datetime,
                measure_type: measure.measure_type,
                has_confirmed: measure.has_confirmed,
                image_url: measure.image_url
            }))
        });

    } catch (error) {
        res.status(500).json({ error_code: "SERVER_ERROR", error_description: "Ocorreu um erro interno" });
    }
};