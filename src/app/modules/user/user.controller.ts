import { Request, Response } from 'express';
import { IUser } from './user.interface';
import { UserServices } from './user.service';

const registerUser = async (req: Request, res: Response) => {
  try {
    const { user: userData } = req.body;

    const user = await UserServices.createUser(userData as IUser);

    res.status(201).json({
      message: 'User created successfully',
      success: true,
      data: user,
    });
  } catch (error) {
    const err = error as Error;
    if (err.name !== 'ValidationError') {
      res.status(500).json({
        message: err.message,
        success: false,
      });
    } else {
      res.status(400).json({
        message: 'Validation failed',
        success: false,
        error,
        stack: err.stack,
      });
    }
  }
};

export const UserControllers = {
  registerUser,
};
