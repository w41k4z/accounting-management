import { RequestHandler } from "express";
import { User } from "../entities/User";
import createHttpError from "http-errors";
import { validate } from "class-validator";

interface signInBody {
  email: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signIn: RequestHandler<any, any, signInBody, any> = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw createHttpError(
        400,
        "Missing parameter. Please provide email and password"
      );
    }

    const user = await User.findOneBy({ email });

    // checking if the user exists
    if (!user) {
      // for security purposes, we don't want to tell the user that the email is not registered
      throw createHttpError(401, "Invalid credentials");
    }

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

interface createBody {
  name: string;
  firstName?: string;
  birthdate: Date;
  email: string;
  phoneNumber?: string;
}
export const create: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  createBody,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { name, firstName, birthdate, email, phoneNumber } = req.body;
    const user = await User.findOneBy({
      email: email,
    });
    // checking if the user already exists
    if (user) {
      throw createHttpError(409, "Email already in use");
    }
    const newUser = new User();
    newUser.name = name;
    newUser.firstName = firstName;
    newUser.birthdate = new Date(birthdate);
    newUser.email = email;
    newUser.phoneNumber = phoneNumber;
    await validate(newUser).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await newUser.save();
      res.status(201).json(newUser);
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByID: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { userID: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const user = await User.findOneByOrFail({ id: parseInt(userID) });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
