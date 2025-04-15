import { Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { TrainConnectionsService } from './train_connections/train-connections.service';
import { CarConnectionsService } from './car_connections/car-connections.service';
import { CarInfoService } from './car-info/car-info.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly trainConnectionsService: TrainConnectionsService,
    private readonly carConnectionsService: CarConnectionsService,
    private readonly carInfoService: CarInfoService,
    @InjectRepository(User)
    private userRepository: Repository<User>) {
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

  @Post('saveCarInfo')
  @UseGuards(AuthGuard('jwt'))
  async saveCarInfo(@Body() formData, @Req() req) {

    const carInfo = formData.carInfo;
    const user = await this.userRepository.findOne({ where: { id: req.user.sub } });

    console.log(carInfo);
    console.log(user);

    if (!carInfo) {
      return {
        success: false,
        message: 'No car information provided'
      };
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${req.user.sub} not found`);
    }

    const carData = await this.carInfoService.saveCarInfo({
      availableSeats: carInfo.availableSeats,
      seatComment: carInfo.seatComment,
      numberPlate: carInfo.numberPlate,
      color: carInfo.color,
      description: carInfo.description,
      user: user
    });

    return { message: 'CarInfo saved', carData };
  }

  @Post('saveCarConnection')
  @UseGuards(AuthGuard('jwt'))
  async saveCarConnection(@Body() formData, @Req() req) {

    const carConnection = formData.carConnection;
    const user = await this.userRepository.findOne({ where: { id: req.user.sub } });
    const carInfoId = formData.carInfo?.id || carConnection.carInfoId;
    const carInfo = await this.carInfoService.findById(carInfoId);

    if (!carInfo) {
      throw new NotFoundException(`CarInfo with ID ${carInfoId} not found`);
    }
    if (!carConnection) {
      return {
        success: false,
        message: 'No car connection provided'
      };
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${req.user.sub} not found`);
    }

    console.log(carConnection);
    console.log(user);
    console.log(carInfo);

    const connectionData = await this.carConnectionsService.saveCarConnection({
      from: carConnection.from,
      to: carConnection.to,
      date: carConnection.date,
      departure: carConnection.departure,
      user: user,
      passengers: [user],
      carInfo: carInfo
    });

    return { message: 'CarConnection saved', connectionData };
  }

  @Post('joinRide/:connectionId')
  @UseGuards(AuthGuard('jwt'))
  async joinRide(@Param('connectionId') connectionId: number, @Req() req) {
    const user = await this.userRepository.findOne({ where: { id: req.user.sub } });

    if (!user) {
      throw new NotFoundException(`User with ID ${req.user.sub} not found`);
    }

    const connection = await this.carConnectionsService.addPassenger(connectionId, user);

    return {
      message: 'Successfully joined the ride',
      connection
    };
  }
}
