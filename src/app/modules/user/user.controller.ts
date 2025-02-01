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
  const { users, meta } = await UserServices.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users data retireved succesfully',
    data: users,
    meta: meta,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await UserServices.getMe(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data retireved succesfully',
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  getUsers,
  getMe,
};
