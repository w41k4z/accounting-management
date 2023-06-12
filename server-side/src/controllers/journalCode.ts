import { RequestHandler } from "express";
import { JournalCode } from "../entities/JournalCode";
import { validate } from "class-validator";
import csvToJson from "csvtojson";
import createHttpError from "http-errors";

export const create: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { code: string; entitled: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { code, entitled } = req.body;
    if (code?.length !== 2) {
      throw new Error("Code must be 2 characters long");
    }
    const journalCode = new JournalCode();
    journalCode.code = code;
    journalCode.entitled = entitled;
    await validate(journalCode).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, "Validation failed!\nError: " + errors);
      }
      await journalCode.save();
      res.status(201).json(journalCode);
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

    const journalCodes: JournalCode[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonArray.map(async (data: any) => {
      const journalCode = new JournalCode();
      journalCode.code = data.Code;
      journalCode.entitled = data.Entitled;
      await validate(journalCode).then(async (errors) => {
        if (errors.length > 0) {
          throw createHttpError(400, errors.toString());
        }
        await journalCode.save();
        journalCodes.push(journalCode);
      });
    });

    res.status(201).json(journalCodes);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { journalCodeID: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { journalCodeID } = req.body;
    const journalCode = await JournalCode.findOneByOrFail({
      id: parseInt(journalCodeID),
    });
    journalCode.remove();
    res.status(200).json(journalCode);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { journalCodeID: string; entitled?: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { journalCodeID, entitled } = req.body;
    const journalCode = await JournalCode.findOneByOrFail({
      id: parseInt(journalCodeID),
    });
    if (entitled) {
      journalCode.entitled = entitled;
    }
    await validate(journalCode).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await journalCode.save();
      res.status(200).json(journalCode);
    });
  } catch (error) {
    next(error);
  }
};

export const get: RequestHandler = async (req, res, next) => {
  try {
    const codes = await JournalCode.find();
    res.status(200).json(codes);
  } catch (error) {
    next(error);
  }
};
