export function buildOjpRequestXml(params: {
    from: string;
    to: string;
    mode?: string;
    datetime?: string;
}) {
    const { from, to, mode = 'pt', datetime } = params;

    const now = datetime || new Date().toISOString();

    return `<?xml version="1.0" encoding="UTF-8"?>
  <OJP xmlns="http://www.vdv.de/ojp"
       version="1.0">
    <OJPRequest>
      <ServiceRequest>
        <RequestTimestamp>${now}</RequestTimestamp>
        <RequestorRef>your-client-id</RequestorRef>
        <OJPTripRequest>
          <Origin>
            <PlaceRef>
              <LocationName>${from}</LocationName>
            </PlaceRef>
            <DepArrTime>${now}</DepArrTime>
          </Origin>
          <Destination>
            <PlaceRef>
              <LocationName>${to}</LocationName>
            </PlaceRef>
          </Destination>
          <Params>
            <IncludeTrackSections>true</IncludeTrackSections>
            <IncludeLegProjection>true</IncludeLegProjection>
            <IncludeIntermediateStops>true</IncludeIntermediateStops>
            <Modes>
              ${generateModeXml(mode)}
            </Modes>
          </Params>
        </OJPTripRequest>
      </ServiceRequest>
    </OJPRequest>
  </OJP>`;
}

function generateModeXml(mode: string) {
    switch (mode) {
        case 'car':
            return `<Mode>
          <IndividualMode>car</IndividualMode>
        </Mode>`;
        case 'pt':
            return `<Mode>
          <PtMode>bus</PtMode>
          <PtMode>rail</PtMode>
          <PtMode>tram</PtMode>
        </Mode>`;
        case 'mixed':
        default:
            return `<Mode>
          <IndividualMode>car</IndividualMode>
        </Mode>
        <Mode>
          <PtMode>bus</PtMode>
          <PtMode>rail</PtMode>
          <PtMode>tram</PtMode>
        </Mode>`;
    }
}