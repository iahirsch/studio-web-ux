// apps/backend/src/app/ojp-api/ojp-api.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OjpApiService } from './ojp-api.service';
import { TravelRequestDto } from './dto/travel-request.dto';

@ApiTags('OJP API')
@Controller('ojp-api')
export class OjpApiController {
    constructor(private readonly ojpApiService: OjpApiService) { }

    @ApiOperation({ summary: 'Get journey information between two locations' })
    @ApiParam({ name: 'from', description: 'Starting location', required: true })
    @ApiParam({ name: 'to', description: 'Destination location', required: true })
    @ApiResponse({ status: 200, description: 'Journey information retrieved successfully' })
    @Get('journey')
    getJourney(
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        return this.ojpApiService.getJourney(from, to);
    }

    @ApiOperation({ summary: 'Search for trip options' })
    @ApiBody({ type: TravelRequestDto })
    @ApiResponse({ status: 200, description: 'Trip options retrieved successfully' })
    @Post('trip')
    async searchTrip(@Body() travelRequest: TravelRequestDto) {
        return this.ojpApiService.searchTrip(travelRequest);
    }
}