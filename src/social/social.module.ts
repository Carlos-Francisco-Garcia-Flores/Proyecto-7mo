import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { RedSocial, RedSocialSchema } from './schemas/red-social.schema';
import { AuthModule } from '../auth/auth.module';  // Importamos AuthModule para usar JWT y autenticación

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RedSocial.name, schema: RedSocialSchema }
    ]),
    AuthModule,
  ],
  providers: [SocialService],
  controllers: [SocialController],
})
export class SocialModule {}
