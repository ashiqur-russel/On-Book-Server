import { IUser } from './user.interface';
import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const registerUser = catchAsync(async (req, res) => {
  const { user: userData } = req.body;

  const result = await UserServices.createUser(userData as IUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created succesfully',
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users data retireved succesfully',
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  getUsers,
};
