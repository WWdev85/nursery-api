import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffModule } from './staff/staff.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [StaffModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
