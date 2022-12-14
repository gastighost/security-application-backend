const Approval = require("../models/Approval");
const User = require("../models/User");
const EntryExit = require("../models/EntryExit");
const createError = require("../utils/create-error");
const { parseDate } = require("../utils/utils");

class ApprovalService {
  async getAll(userId, locationId, username, page) {
    let skip;
    let limit;

    if (page) {
      skip = (page - 1) * 10;
      limit = 10;
    }

    const approvals = await Approval.find({
      locationId,
      username: new RegExp(username, "gi"),
    })
      .populate([
        "locationId",
        { path: "userId", select: "-password" },
        "validatedBy",
      ])
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    let filteredApprovals = approvals.filter((approval) =>
      approval.locationId?.adminIds?.some(
        (id) => id.toString() === userId.toString()
      )
    );

    const objectFilteredApprovals = filteredApprovals.map((approval) => {
      const objectApproval = approval.toObject();
      delete objectApproval.locationId;
      return objectApproval;
    });

    return objectFilteredApprovals;
  }

  async getOne(approvalId, userId) {
    const approval = await Approval.findById(approvalId).populate([
      "locationId",
      { path: "userId", select: "-password" },
      { path: "validatedBy", select: "-password" },
    ]);

    const isLocationAdmin = approval.locationId?.adminIds?.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isLocationAdmin) {
      throw createError("You are not authorized to view this approval", 403);
    }

    return approval;
  }

  async create({ userId, locationId, dateTimeFrom, dateTimeTo, purpose }) {
    const approvals = await Approval.find({ userId, locationId });

    const sameDateTimeFrom = approvals.some((approval) => {
      return (
        parseDate(approval.dateTimeFrom) <= parseDate(dateTimeFrom) &&
        parseDate(dateTimeFrom) <= parseDate(approval.dateTimeTo)
      );
    });

    if (sameDateTimeFrom) {
      throw createError(
        "Starting date overlaps with another existing approval",
        400
      );
    }

    const sameDateTimeTo = approvals.some((approval) => {
      return (
        parseDate(approval.dateTimeFrom) <= parseDate(dateTimeTo) &&
        parseDate(dateTimeTo) <= parseDate(approval.dateTimeTo)
      );
    });

    if (sameDateTimeTo) {
      throw createError(
        "Ending date overlaps with another existing approval",
        400
      );
    }

    const user = await User.findById(userId);

    const newApproval = await Approval.create({
      userId,
      username: user.username,
      locationId,
      dateTimeFrom,
      dateTimeTo,
      purpose,
    });

    return newApproval;
  }

  async validate({ approvalId, validated, userId }) {
    const approval = await Approval.findById(approvalId).populate("locationId");

    if (!approval) {
      throw createError("Approval with this id was not found", "400");
    }

    const canValidate = approval.locationId?.adminIds?.some(
      (id) => id.toString() === userId.toString()
    );

    if (!canValidate) {
      throw createError(
        "You are not authorized to validate this approval",
        403
      );
    }

    approval.validated = validated;
    approval.validatedBy = userId;
    await approval.save();

    return approval;
  }

  async allEntryExits(approvalId, userId) {
    const approval = await Approval.findById(approvalId).populate("locationId");

    if (!approval) {
      throw createError("No approval with this id was found", 400);
    }

    const isLocationAdmin = approval.locationId?.adminIds?.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isLocationAdmin) {
      throw createError("You are not authorized to view entry exits", 403);
    }

    const entryExits = await EntryExit.find({ approvalId: approval._id }).sort(
      "-createdAt"
    );

    return entryExits;
  }

  async enter(approvalId, userId) {
    const approval = await Approval.findById(approvalId).populate("locationId");

    if (!approval) {
      throw createError("No approval with this id was found", 400);
    }

    if (!approval.validated) {
      throw createError("This approval is not validated", 403);
    }

    const isLocationAdmin = approval.locationId?.adminIds?.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isLocationAdmin) {
      throw createError(
        "You are not authorized to grant entry to this user",
        403
      );
    }

    const parsedDateNow = Date.parse(new Date());
    const parsedDateTimeFrom = Date.parse(new Date(approval.dateTimeFrom));
    const parsedDateTimeTo = Date.parse(new Date(approval.dateTimeTo));

    if (parsedDateNow < parsedDateTimeFrom) {
      throw createError(
        `This approval is not yet valid. Approval will be valid on ${approval.dateTimeFrom}`,
        403
      );
    }

    if (parsedDateNow > parsedDateTimeTo) {
      throw createError(`This approval expired on ${approval.dateTimeTo}`, 403);
    }

    const newEntryExit = await EntryExit.create({
      approvalId: approval._id,
      locationId: approval.locationId,
      entryDate: new Date().toLocaleString("en-US"),
    });

    return newEntryExit;
  }

  async exit(entryExitId, userId) {
    const entryExit = await EntryExit.findById(entryExitId).populate([
      "locationId",
      "approvalId",
    ]);

    if (!entryExit) {
      throw createError(
        "No entry exit record has been found with this id",
        400
      );
    }

    const isLocationAdmin = entryExit.locationId?.adminIds?.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isLocationAdmin) {
      throw createError("You are not authorized to record exits", 403);
    }

    const exitDate = new Date().toLocaleString("en-US");

    entryExit.exitDate = exitDate;

    const exitDateParsed = Date.parse(new Date(exitDate));
    const approvalDateToParsed = Date.parse(
      new Date(entryExit.approvalId?.dateTimeTo)
    );

    if (exitDateParsed > approvalDateToParsed) {
      entryExit.overstayed = true;
    } else {
      entryExit.overstayed = false;
    }

    await entryExit.save();

    return entryExit;
  }
}

module.exports = new ApprovalService();
