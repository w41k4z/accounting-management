import { RequestHandler } from "express";
import {
  ThirdPartyChartOfAccount,
  AccountType,
} from "../entities/ThirdPartyChartOfAccount";
import { validate } from "class-validator";
import createHttpError from "http-errors";
import csvToJson from "csvtojson";

export const create: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { type: string; account: string; entitled: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { type, entitled } = req.body;
    const thirdPartyChartOfAccount = new ThirdPartyChartOfAccount();
    thirdPartyChartOfAccount.type =
      type == "FO" ? AccountType.FO : AccountType.CL;
    thirdPartyChartOfAccount.entitled = entitled;

    await validate(thirdPartyChartOfAccount).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await thirdPartyChartOfAccount.save();
      res.status(201).json(thirdPartyChartOfAccount);
    });
  } catch (error) {
    next(error);
  }
};

export const upload: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }
    const filePath = req.file.path;
    const jsonArray = await csvToJson({ delimiter: [";"] }).fromFile(filePath);

    const thirdPartyChartOfAccounts: ThirdPartyChartOfAccount[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonArray.map(async (data: any) => {
      const thirdPartyChartOfAccount = new ThirdPartyChartOfAccount();
      thirdPartyChartOfAccount.type =
        data.type == "FO" ? AccountType.FO : AccountType.CL;
      thirdPartyChartOfAccount.entitled = data.entitled;
      await validate(thirdPartyChartOfAccount).then(async (errors) => {
        if (errors.length > 0) {
          throw createHttpError(400, errors.toString());
        }
        await thirdPartyChartOfAccount.save();
        thirdPartyChartOfAccounts.push(thirdPartyChartOfAccount);
      });
    });

    res.status(201).json(thirdPartyChartOfAccounts);
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
    thirdPartyChartOfAccountID: string;
    type: string;
    entitled?: string;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { thirdPartyChartOfAccountID, type, entitled } = req.body;
    const thirdPartyChartOfAccount =
      await ThirdPartyChartOfAccount.findOneByOrFail({
        id: parseInt(thirdPartyChartOfAccountID),
      });
    if (type) {
      thirdPartyChartOfAccount.type =
        type == "FO" ? AccountType.FO : AccountType.CL;
    }
    if (entitled) {
      thirdPartyChartOfAccount.entitled = entitled;
    }
    await validate(thirdPartyChartOfAccount).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await thirdPartyChartOfAccount.save();
      res.status(200).json(thirdPartyChartOfAccount);
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
  { thirdPartyChartOfAccountID: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { thirdPartyChartOfAccountID } = req.body;
    const thirdPartyChartOfAccount =
      await ThirdPartyChartOfAccount.findOneByOrFail({
        id: parseInt(thirdPartyChartOfAccountID),
      });
    await thirdPartyChartOfAccount.remove();
    res.status(200).json(thirdPartyChartOfAccount);
  } catch (error) {
    next(error);
  }
};

export const get: RequestHandler = async (req, res, next) => {
  try {
    const thirdPartyChartOfAccounts = await ThirdPartyChartOfAccount.find();
    res.status(200).json(thirdPartyChartOfAccounts);
  } catch (error) {
    next(error);
  }
};
