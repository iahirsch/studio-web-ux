// apps/backend/src/app/ojp-api/dto/travel-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class TravelRequestDto {
    @ApiProperty({
        description: 'Starting location name or coordinates',
        example: 'Bern'
    })
    from: string;

    @ApiProperty({
        description: 'Destination location name or coordinates',
        example: 'Zürich'
    })
    to: string;

    @ApiProperty({
        description: 'Travel mode',
        enum: ['train', 'car'],
        example: 'train'
    })
    mode: 'train' | 'car';

    @ApiProperty({
        description: 'Travel date in YYYY-MM-DD format',
        example: '2025-03-30'
    })
    date: string;

    @ApiProperty({
        description: 'Travel time in HH:MM format',
        example: '09:30'
    })
    time: string;
}