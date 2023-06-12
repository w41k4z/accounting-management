import { RequestHandler } from "express";
import { Society } from "../entities/Society";
import { User } from "../entities/User";
import { Currency } from "../entities/Currency";
import { validate } from "class-validator";
import createHttpError from "http-errors";

export const authenticate: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { societyID: string; password: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { societyID, password } = req.body;
    if (!societyID || !password) {
      throw new Error("Missing parameter.");
    }
    const society = await Society.findOneBy({
      id: parseInt(societyID),
      password,
    });
    if (!society) {
      throw createHttpError(400, "Invalid credentials.");
    }
    res.status(200).json(society);
  } catch (error) {
    next(error);
  }
};

interface updateBody {
  societyID: string;
  name?: string;
  logo?: string;
  password?: string;
  address?: string;
  headquarters?: string;
  taxIdentificationNumber?: string;
  statisticalNumber?: string;
  commercialRegisterNumber?: string;
  status?: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const update: RequestHandler<any, any, updateBody, any> = async (
  req,
  res,
  next
) => {
  try {
    const {
      societyID,
      name,
      logo,
      password,
      address,
      headquarters,
      taxIdentificationNumber,
      statisticalNumber,
      commercialRegisterNumber,
      status,
    } = req.body;
    const society = await Society.findOneByOrFail({ id: parseInt(societyID) });
    if (name) {
      society.name = name;
    }
    if (logo) {
      society.logo = logo;
    }
    if (password) {
      society.password = password;
    }
    if (address) {
      society.address = address;
    }
    if (headquarters) {
      society.headquarters = headquarters;
    }
    if (taxIdentificationNumber) {
      society.taxIdentificationNumber = taxIdentificationNumber;
    }
    if (statisticalNumber) {
      society.statisticalNumber = statisticalNumber;
    }
    if (commercialRegisterNumber) {
      society.commercialRegisterNumber = commercialRegisterNumber;
    }
    if (status) {
      society.status = status;
    }
    await validate(society).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await society.save();
      res.status(201).json(society);
    });
  } catch (error) {
    next(error);
  }
};

interface createBody {
  name: string;
  ceo: string;
  logo: string;
  password: string;
  object: string;
  address: string;
  headquarters: string;
  creationDate: Date;
  taxIdentificationNumber?: string;
  statisticalNumber?: string;
  commercialRegisterNumber?: string;
  status?: string;
  startDateOfAccountingPeriod: Date;
  accountingCurrency: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const create: RequestHandler<any, any, createBody, any> = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      ceo,
      logo,
      password,
      object,
      address,
      headquarters,
      creationDate,
      taxIdentificationNumber,
      statisticalNumber,
      commercialRegisterNumber,
      status,
      startDateOfAccountingPeriod,
      accountingCurrency,
    } = req.body;
    const society = new Society();
    const societyCeo = await User.findOneByOrFail({ id: parseInt(ceo) });
    const societyCurrency = await Currency.findOneByOrFail({
      id: parseInt(accountingCurrency),
    });
    society.name = name;
    society.ceo = societyCeo;
    society.logo = logo;
    society.password = password;
    society.object = object;
    society.address = address;
    society.headquarters = headquarters;
    society.creationDate = creationDate;
    society.taxIdentificationNumber = taxIdentificationNumber;
    society.statisticalNumber = statisticalNumber;
    society.commercialRegisterNumber = commercialRegisterNumber;
    society.status = status;
    society.startDateOfAccountingPeriod = startDateOfAccountingPeriod;
    society.currency = societyCurrency;

    await validate(society).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await society.save();
      res.status(201).json(society);
    });
  } catch (error) {
    next(error);
  }
};

export const dev: RequestHandler = async (req, res, next) => {
  try {
    const dimpex = await Society.findOneBy({ id: 1 });
    res.status(200).json(dimpex);
  } catch (error) {
    next(error);
  }
};
