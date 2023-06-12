import { RequestHandler } from "express";
import { Currency } from "../entities/Currency";
import createHttpError from "http-errors";
import { validate } from "class-validator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const create: RequestHandler<any, any, { label: string }, any> = async (
  req,
  res,
  next
) => {
  try {
    const { label } = req.body;
    if (label.length !== 3) {
      throw createHttpError(400, "Label must be 3 characters long");
    }
    const currency = new Currency();
    currency.label = label;
    await validate(currency).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await currency.save();
      res.status(201).json(currency);
    });
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { currencyID: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { currencyID } = req.body;
    const currency = await Currency.findOneByOrFail({
      id: parseInt(currencyID),
    });
    await currency.remove();
    res.status(200).json(currency);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  {
    currencyID: string;
    label: string;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { currencyID, label } = req.query;
    const currency = await Currency.findOneByOrFail({
      id: parseInt(currencyID),
    });
    if (label) {
      currency.label = label;
    }
    await validate(currency).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await currency.save();
      res.status(200).json(currency);
    });
  } catch (error) {
    next(error);
  }
};
