import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { buildOjpRequestXml } from './ojp-request-builder';
import { parseOjpResponse } from './ojp-response-parser';

@Injectable()
export class OjpApiService {
    async getJourney(params: {
        from: string;
        to: string;
        mode?: string;
        datetime?: string;
    }) {
        try {
            const xmlBody = buildOjpRequestXml(params);
            console.log('Gesaendeter XML-Body:', xmlBody);  // Hier loggen wir den XML-Body

            const response = await axios.post(
                'https://api.opentransportdata.swiss/ojp20',
                xmlBody,
                {
                    headers: {
                        'Content-Type': 'text/xml',
                        'Authorization': `Bearer ${process.env.OJP_API_TOKEN}`
                    }
                }
            );
            console.log('Antwort der OJP-API:', response.data);  // Hier loggen wir die Antwort

            const json = await parseOjpResponse(response.data);
            return json;
        } catch (error) {
            console.error('Fehler bei der API-Anfrage:', error.response || error.message);
            throw new Error('Fehler bei der Verbindung zur OJP-API');
        }
    }
}