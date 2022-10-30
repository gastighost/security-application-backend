const ApprovalService = require("../services/approval-service");
const asyncWrapper = require("../utils/async-wrapper");
const validationError = require("../utils/validation-error");

const getAllApprovals = asyncWrapper(async (req, res) => {
  const { userId } = req.user;
  const { username } = req.query;
  const { locationId } = req.params;

  const approvals = await ApprovalService.getAll(userId, locationId, username);

  res
    .status(200)
    .json({ message: "Approvals were successfully collected", approvals });
});

const getOneApproval = asyncWrapper(async (req, res) => {
  const { userId } = req.user;
  const { approvalId } = req.params;

  const approval = await ApprovalService.getOne(approvalId, userId);

  res
    .status(200)
    .json({ message: "Approval details successfully retrieved!", approval });
});

const createApproval = asyncWrapper(async (req, res) => {
  validationError(req);

  const { userId } = req.user;
  const { locationId } = req.params;
  const { dateTimeFrom, dateTimeTo, purpose } = req.body;

  const newApproval = await ApprovalService.create({
    userId,
    locationId,
    dateTimeFrom,
    dateTimeTo,
    purpose,
  });

  res.status(201).json({
    message: "Approval request was successfully created!",
    newApproval,
  });
});

const validateApproval = asyncWrapper(async (req, res) => {
  validationError(req);

  const { userId } = req.user;
  const { approvalId } = req.params;
  const { validated } = req.body;

  const approval = await ApprovalService.validate({
    approvalId,
    validated,
    userId,
  });

  res.status(200).json({
    message: "Approval request was successfully validated!",
    approval,
  });
});

const getAllEntryExits = asyncWrapper(async (req, res) => {
  const { userId } = req.user;
  const { approvalId } = req.params;

  const entryExits = await ApprovalService.allEntryExits(approvalId, userId);

  res.status(200).json({
    message: "Successfully retrieved all entry exits for this approval",
    entryExits,
  });
});

const approvalEntry = asyncWrapper(async (req, res) => {
  const { userId } = req.user;
  const { approvalId } = req.params;

  const newEntryExit = await ApprovalService.enter(approvalId, userId);

  res.status(200).json({ message: "Entry accepted!", newEntryExit });
});

const approvalExit = asyncWrapper(async (req, res) => {
  const { userId } = req.user;
  const { entryExitId } = req.params;

  const entryExit = await ApprovalService.exit(entryExitId, userId);

  res.status(200).json({ message: "Exit successfully recorded!", entryExit });
});

module.exports = {
  getAllApprovals,
  getOneApproval,
  createApproval,
  validateApproval,
  getAllEntryExits,
  approvalEntry,
  approvalExit,
};
