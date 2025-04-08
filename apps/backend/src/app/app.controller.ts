import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { TrainConnectionsService } from './train_connections/train-connections.service';
import { CarConnectionsService } from './car_connections/car-connections.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly trainConnectionsService: TrainConnectionsService,
    private readonly carConnectionsService: CarConnectionsService) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getData() {
    return this.appService.getData();
  }

  @Get('getJourney')
  getJourney() {
    return this.appService.getJourney();
  }

  @Post('saveJourney')
  async saveJourney(@Body() journeyData: any) {

    /*TODO: access Token for validation and foreignKey*/

    /*const journey = await this.trainConnectionsService.saveJourney(journeyData);

    return { message: 'Journey saved', journey };*/
  }
}
