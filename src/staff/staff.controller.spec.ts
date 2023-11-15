import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { AddressDto } from '../dtos';
import { CreateStaffResponse } from 'types';

describe('StaffController', () => {
  let controller: StaffController;
  let staffService: StaffService;

  const mockPhoto = {
    filename: 'mockPhoto.jpg',
    size: 2000,
    mimetype: 'image/jpeg',
    originalname: 'mockPhoto.jpg',
    fieldname: 'photo',
    encoding: '7bit'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useValue: {
            addStaffMember: jest.fn(),
            updateStaff: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StaffController>(StaffController);
    staffService = module.get<StaffService>(StaffService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addStaff', () => {
    const staff: CreateStaffDto = {
      name: 'John',
      surname: 'Doe',
      address: new AddressDto,
      email: 'mail@test.com',
      phone: '789789789',
      isVisible: false,
      roleId: '1'
    };



    it('should successfully create a staff member', async () => {
      jest.spyOn(staffService, 'addStaffMember').mockResolvedValue(CreateStaffResponse.Success);
      expect(await controller.addStaff(staff, { photo: [mockPhoto] })).toEqual(CreateStaffResponse.Success);
    });

    it('should handle error during staff member creation', async () => {
      const errorMessage = 'Error creating staff member';
      jest.spyOn(staffService, 'addStaffMember').mockRejectedValue(new Error(errorMessage));
      await expect(controller.addStaff(staff, { photo: [mockPhoto] })).rejects.toThrow(errorMessage);
    });
  });

  describe('updateStaff', () => {
    const updatedStaff: UpdateStaffDto = {
      id: '1',
      name: 'John',
      surname: 'Doe',
      address: new AddressDto,
      email: 'mail@test.com',
      phone: '789789789',
      isVisible: false,
      roleId: '1'
    };


    it('should successfully update a staff member', async () => {
      jest.spyOn(staffService, 'updateStaff').mockResolvedValue('Staff member updated successfully');
      expect(await controller.updateStaff(updatedStaff, { photo: [mockPhoto] })).toEqual('Staff member updated successfully');
    });

    it('should handle error during staff member update', async () => {
      const errorMessage = 'Error updating staff member';
      jest.spyOn(staffService, 'updateStaff').mockRejectedValue(new Error(errorMessage));
      await expect(controller.updateStaff(updatedStaff, { photo: [mockPhoto] })).rejects.toThrow(errorMessage);
    });

  });
});
