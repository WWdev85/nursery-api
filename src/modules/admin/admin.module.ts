import { Module, forwardRef } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    forwardRef(() => MailModule)
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }
