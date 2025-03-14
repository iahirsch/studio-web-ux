import { Controller, Get, Query } from '@nestjs/common';
import { OjpApiService } from './ojp-api.service';

@Controller('ojp-api')
export class OjpApiController {
    constructor(private readonly ojpApiService: OjpApiService) { }

    @Get('journey')
    getJourney(
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        return this.ojpApiService.getJourney(from, to);
    }
}
