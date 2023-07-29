import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [
    UserModule
  ]
})
export class ContactModule {}
