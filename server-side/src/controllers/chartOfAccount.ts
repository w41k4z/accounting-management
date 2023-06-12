import { RequestHandler } from "express";
import { GeneralChartOfAccount } from "../entities/GeneralChartOfAccount";
import csvToJson from "csvtojson";
import createHttpError from "http-errors";
import { validate } from "class-validator";

interface createBody {
  accountNumber: string;
  entitled: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const create: RequestHandler<any, any, createBody, any> = async (
  req,
  res,
  next
) => {
  try {
    const { accountNumber, entitled } = req.body;
    const chartOfAccount = new GeneralChartOfAccount();
    chartOfAccount.accountNumber = accountNumber;
    chartOfAccount.entitled = entitled;

    await validate(chartOfAccount).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await chartOfAccount.save();
      res.status(201).json(chartOfAccount);
    });
  } catch (error) {
    next(error);
  }
};

export const upload: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, "No file uploaded");
    }
    const filePath = req.file.path;
    const jsonArray = await csvToJson({ delimiter: [";"] }).fromFile(filePath);

    const chartOfAccounts: GeneralChartOfAccount[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonArray.map(async (data: any) => {
      const chartOfAccount = new GeneralChartOfAccount();
      chartOfAccount.accountNumber = data.AccountNumber;
      chartOfAccount.entitled = data.Entitled;
      await validate(chartOfAccount).then(async (errors) => {
        if (errors.length > 0) {
          throw createHttpError(400, errors.toString());
        }
        await chartOfAccount.save();
        chartOfAccounts.push(chartOfAccount);
      });
    });

    res.status(201).json(chartOfAccounts);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { chartOfAccountID: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { chartOfAccountID } = req.body;
    const chartOfAccount = await GeneralChartOfAccount.findOneByOrFail({
      id: parseInt(chartOfAccountID),
    });
    await chartOfAccount.remove();
    res.status(200).json(chartOfAccount);
  } catch (error) {
    next(error);
  }
};

interface updateBody {
  chartOfAccountID: string;
  entitled: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const update: RequestHandler<any, any, updateBody, any> = async (
  req,
  res,
  next
) => {
  try {
    const { chartOfAccountID, entitled } = req.body;
    const chartOfAccount = await GeneralChartOfAccount.findOneByOrFail({
      id: parseInt(chartOfAccountID),
    });
    if (entitled) {
      chartOfAccount.entitled = entitled;
    }
    await validate(chartOfAccount).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await chartOfAccount.save();
      res.status(200).json(chartOfAccount);
    });
  } catch (error) {
    next(error);
  }
};

export const get: RequestHandler = async (req, res, next) => {
  try {
    const chartOfAccounts = await GeneralChartOfAccount.find();
    res.status(200).json(chartOfAccounts);
  } catch (error) {
    next(error);
  }
};
