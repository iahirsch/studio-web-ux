import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OjpApiService {
    async getJourney(from: string, to: string) {
        try {
            // XML als String definieren
            const xmlRequestBody = `<?xml version="1.0" encoding="utf-8"?>
        <OJP xmlns:siri="http://www.siri.org.uk/siri" version="2.0" xmlns="http://www.vdv.de/ojp">
          <!-- Hier können die spezifischen Parameter eingefügt werden -->
          <Request>
            <From>${from}</From>
            <To>${to}</To>
            <DepartureTime>2025-03-14T08:30:00</DepartureTime>
          </Request>
        </OJP>`;

            // API-Anfrage mit Axios und Bearer Token
            const response = await axios.post(
                process.env.OJP_API_URL,
                xmlRequestBody,
                {
                    headers: {
                        'Content-Type': 'application/xml',
                        Authorization: `Bearer ${process.env.OJP_API_TOKEN}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Fehler beim OJP API Call', error);
            throw new Error('OJP API Anfrage fehlgeschlagen');
        }
    }
}
