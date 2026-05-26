import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BotService } from './bot/bot.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 3000);

  console.log('HTTP started')

  const botService = app.get(BotService)

  await botService.launch()
}
bootstrap();
