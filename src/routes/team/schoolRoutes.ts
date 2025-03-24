import express from "express";
import multer from "multer";
const upload = multer();
import {
  getSchoolById,
  getSchools,
  updateSchool,
  deleteSchool,
  createSchool,
  searchSchools,
  searchSchool,
  getSchoolPaymentById,
  getSchoolPayments,
  updateSchoolPayment,
  deleteSchoolPayment,
  createSchoolPayment,
  getCourseById,
  getCourses,
  updateCourse,
  deleteCourse,
  createCourse,
  getDepartmentById,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  createDepartment,
  getFacultyById,
  getFaculties,
  updateFaculty,
  deleteFaculty,
  createFaculty,
} from "../../controllers/team/schoolController";

const router = express.Router();

router.route("/search").get(searchSchools);
router.route("/find").get(searchSchool);
router.route("/").get(getSchools).post(upload.any(), createSchool);
router
  .route("/payments")
  .get(getSchoolPayments)
  .post(upload.any(), createSchoolPayment);
router.route("/courses").get(getCourses).post(upload.any(), createCourse);
router
  .route("/departments")
  .get(getDepartments)
  .post(upload.any(), createDepartment);
router.route("/faculties").get(getFaculties).post(upload.any(), createFaculty);

router
  .route("/faculties/:id")
  .get(getFacultyById)
  .patch(upload.any(), updateFaculty)
  .delete(deleteFaculty);

router
  .route("/departments/:id")
  .get(getDepartmentById)
  .patch(upload.any(), updateDepartment)
  .delete(deleteDepartment);

router
  .route("/courses/:id")
  .get(getCourseById)
  .patch(upload.any(), updateCourse)
  .delete(deleteCourse);

router
  .route("/payments/:id")
  .get(getSchoolPaymentById)
  .patch(upload.any(), updateSchoolPayment)
  .delete(deleteSchoolPayment);

router
  .route("/:id")
  .get(getSchoolById)
  .patch(upload.any(), updateSchool)
  .delete(deleteSchool);

export default router;
