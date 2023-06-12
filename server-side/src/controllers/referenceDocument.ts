import { RequestHandler } from "express";
import { ReferenceDocument } from "../entities/ReferenceDocument";
import { validate } from "class-validator";
import csvToJson from "csvtojson";
import createHttpError from "http-errors";

export const create: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { reference: string; meaning: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { reference, meaning } = req.body;
    if (reference.length !== 2) {
      throw createHttpError(400, "Reference must be 2 characters long");
    }
    const referenceDocument = new ReferenceDocument();
    referenceDocument.reference = reference;
    referenceDocument.meaning = meaning;
    await validate(referenceDocument).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await referenceDocument.save();
      res.status(201).json(referenceDocument);
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

    const referenceDocuments: ReferenceDocument[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonArray.map(async (data: any) => {
      const referenceDocument = new ReferenceDocument();
      referenceDocument.reference = data.Reference;
      referenceDocument.meaning = data.Meaning;
      await validate(referenceDocument).then(async (errors) => {
        if (errors.length > 0) {
          throw createHttpError(400, errors.toString());
        }
        await referenceDocument.save();
        referenceDocuments.push(referenceDocument);
      });
    });

    res.status(201).json(referenceDocuments);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { referenceDocumentID: string; meaning?: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { referenceDocumentID, meaning } = req.body;
    const referenceDocument = await ReferenceDocument.findOneByOrFail({
      id: parseInt(referenceDocumentID),
    });
    if (meaning) {
      referenceDocument.meaning = meaning;
    }
    await validate(referenceDocument).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await referenceDocument.save();
      res.status(200).json(referenceDocument);
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
  { referenceDocumentID: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { referenceDocumentID } = req.body;
    const referenceDocument = await ReferenceDocument.findOneByOrFail({
      id: parseInt(referenceDocumentID),
    });
    await validate(referenceDocument).then(async (errors) => {
      if (errors.length > 0) {
        throw createHttpError(400, errors.toString());
      }
      await referenceDocument.remove();
      res.status(200).json(referenceDocument);
    });
  } catch (error) {
    next(error);
  }
};

export const get: RequestHandler = async (req, res, next) => {
  try {
    const codes = await ReferenceDocument.find();
    res.status(200).json(codes);
  } catch (error) {
    next(error);
  }
};
