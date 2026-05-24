import { Module } from '@nestjs/common';
import { ThankfulnessService, } from './thankfulness.service';

@Module({
    providers: [ThankfulnessService],
    exports: [ThankfulnessService],
})
export class ThankfulnessModule { }