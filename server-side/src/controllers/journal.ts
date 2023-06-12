import { RequestHandler } from "express";
import { Journal, IDetail } from "../entities/Journal";
import { JournalCode } from "../entities/JournalCode";
import { Society } from "../entities/Society";
import { ReferenceDocument } from "../entities/ReferenceDocument";
import { GeneralChartOfAccount } from "../entities/GeneralChartOfAccount";
import { ThirdPartyChartOfAccount } from "../entities/ThirdPartyChartOfAccount";
import csvToJson from "csvtojson";
import createHttpError from "http-errors";
import { AppDataSource } from "../data-source";

interface createBody {
  societyID: string;
  date: Date;
  code: string;
  reference: string;
  refNumber: string;
  description: string;
  details: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const create: RequestHandler<any, any, createBody, any> = async (
  req,
  res,
  next
) => {
  try {
    const {
      societyID,
      date,
      code,
      reference,
      refNumber,
      description,
      details,
    } = req.body;

    const society = await Society.findOneByOrFail({
      id: parseInt(societyID),
    });
    const journalCode = await JournalCode.findOneByOrFail({
      id: parseInt(code),
    });
    const referenceDocument = await ReferenceDocument.findOneByOrFail({
      id: parseInt(reference),
    });

    const realDetails = JSON.parse(details);
    const newJournal = new Journal();
    newJournal.society = society;
    newJournal.journalDate = date;
    newJournal.code = journalCode;
    newJournal.reference = referenceDocument;
    newJournal.referenceNumber = refNumber;
    newJournal.description = description;

    const journalDetails: IDetail[] = [];
    for (const detail of realDetails) {
      const generalAccount = await GeneralChartOfAccount.findOneByOrFail({
        id: parseInt(detail.generalAccount),
      });
      const thirdPartyAccount = await ThirdPartyChartOfAccount.findOneByOrFail({
        id: parseInt(detail.thirdPartyAccount),
      });
      journalDetails.push({
        generalChartOfAccount: generalAccount,
        thirdPartyChartOfAccount: thirdPartyAccount,
        debit: detail.debit,
        credit: detail.credit,
      });
    }

    await newJournal.saveDetailedJournal(journalDetails);
    res.status(201).json(newJournal);
  } catch (error) {
    next(error);
  }
};

export const upload: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { societyID: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, "No file uploaded");
    }

    const filePath = req.file.path;
    const jsonArray = await csvToJson({ delimiter: [";"] }).fromFile(filePath);
    const dateString = jsonArray[0].Date;
    const [day, month, year] = dateString.split("/");
    const journal = new Journal();

    const society = await Society.findOneByOrFail({
      id: parseInt(req.body.societyID),
    });
    const journalCode = await JournalCode.findOneByOrFail({
      code: jsonArray[0].Code,
    });
    const referenceDocument = await ReferenceDocument.findOneByOrFail({
      reference: jsonArray[0].Reference,
    });

    journal.society = society;
    journal.journalDate = new Date(year, month - 1, day);
    journal.code = journalCode;
    journal.reference = referenceDocument;
    journal.referenceNumber = jsonArray[0].RefNumber;
    journal.description = jsonArray[0].Description;

    const journalDetails: IDetail[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonArray.map(async (data: any) => {
      const generalAccount = await GeneralChartOfAccount.findOneByOrFail({
        id: parseInt(data.GeneralChartOfAccount),
      });
      const thirdPartyAccount = await ThirdPartyChartOfAccount.findOneByOrFail({
        id: parseInt(data.ThirdPartyAccount),
      });

      journalDetails.push({
        generalChartOfAccount: generalAccount,
        thirdPartyChartOfAccount: thirdPartyAccount,
        debit: data.Debit,
        credit: data.Credit,
      });
    });

    await journal.saveDetailedJournal(journalDetails);
    res.status(201).json(journal);
  } catch (error) {
    next(error);
  }
};

export const get: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { societyID: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { societyID } = req.body;
    const society = await Society.findOneByOrFail({ id: parseInt(societyID) });
    const journals = await AppDataSource.getRepository(Journal)
      .createQueryBuilder("journals")
      .where("journals.society_id = :id", { id: society.id })
      .getMany();
    res.status(200).json(journals);
  } catch (error) {
    next(error);
  }
};

export const journals: RequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  { societyID: string; code: string; month: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = async (req, res, next) => {
  try {
    const { societyID, code, month } = req.body;
    const [theMonth, theYear] = month.split("-").map((x) => parseInt(x));
    const society = await Society.findOneByOrFail({ id: parseInt(societyID) });
    const journalCode = await JournalCode.findOneByOrFail({ code });
    const journals = await AppDataSource.getRepository(Journal)
      .createQueryBuilder("journals")
      .where("jounals.society_id = :id", { id: society.id })
      .andWhere("journals.code = :code", { code: journalCode.code })
      .andWhere("journals.journal_date >= :date", {
        date: new Date(theYear, theMonth - 1, 1),
      })
      .andWhere("journals.journal_date < :date", {
        date: new Date(theYear, theMonth, 1),
      })
      .getMany();
    res.status(200).json(journals);
  } catch (error) {
    next(error);
  }
};

// export const remove: RequestHandler<
//   any,
//   any,
//   { chartOfAccountID: string },
//   any
// > = async (req, res, next) => {
//   try {
//     const { chartOfAccountID } = req.body;
//     const dbChartOfAccount = await ChartOfAccountModel.findByIdAndDelete(
//       chartOfAccountID
//     );
//     if (!dbChartOfAccount) {
//       throw new Error("Chart of account not found");
//     }
//     res.status(200).json(dbChartOfAccount);
//   } catch (error) {
//     next(error);
//   }
// };

// interface updateBody {
//   chartOfAccountID: string;
//   entitled: string;
// }
// export const update: RequestHandler<any, any, updateBody, any> = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const { chartOfAccountID, entitled } = req.body;
//     const dbChartOfAccount = await ChartOfAccountModel.findById(
//       chartOfAccountID
//     );
//     if (!dbChartOfAccount) {
//       throw new Error("Chart of account not found");
//     }
//     if (entitled) {
//       dbChartOfAccount.entitled = entitled;
//     }
//     await dbChartOfAccount.save();
//     res.status(200).json(dbChartOfAccount);
//   } catch (error) {
//     next(error);
//   }
// };
