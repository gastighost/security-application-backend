const { Router } = require("express");
const { body } = require("express-validator");
const {
  createApproval,
  getAllApprovals,
  validateApproval,
  approvalEntry,
  approvalExit,
  getAllEntryExits,
  getOneApproval,
} = require("../controllers/approval-controller");
const auth = require("../middleware/auth");

const router = Router();

// ** Admins can get all approvals under a particular location with the option to query by username
router.get("/:locationId", auth, getAllApprovals);

// ** Get individual approval details by approval id
router.get("/approval-details/:approvalId", auth, getOneApproval);

// ** Any visitor user can create an approval request under a particular location
// ** Approval status will initially be false and should be confirmed by location admin
router.post(
  "/request/:locationId",
  auth,
  [
    body("dateTimeFrom", "Date time from should be a valid date")
      .toDate()
      .isISO8601()
      .bail()
      .customSanitizer((date) => date.toLocaleString("en-US")),
    body("dateTimeTo", "Date time to should be a valid date")
      .toDate()
      .isISO8601()
      .bail()
      .customSanitizer((date) => date.toLocaleString("en-US")),
    body("purpose", "Purpose must not be empty")
      .trim()
      .exists({ checkFalsy: true }),
  ],
  createApproval
);

// ** Location admins should then approve the approval requests
router.patch(
  "/validate/:approvalId",
  auth,
  [
    body("validated", "Validated should be either true or false")
      .isBoolean()
      .toBoolean(),
  ],
  validateApproval
);

// ** Get all entry exit records for a particular approval
router.get("/entry-exit/:approvalId", auth, getAllEntryExits);

// ** Allow user to enter based on approval id and record user entry
router.post("/entry/:approvalId", auth, approvalEntry);

// ** Record user exit based on existing entry exit id
router.patch("/exit/:entryExitId", auth, approvalExit);

module.exports = router;
