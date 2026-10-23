const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createDoctorSchema,
  updateDoctorSchema,
  idParamSchema,
} = require('../middleware/schemas');

router.use(auth);

router.post('/', validate(createDoctorSchema), doctorController.createDoctor);
router.get('/', doctorController.getDoctors);
router.get('/:id', validate(idParamSchema), doctorController.getDoctorById);
router.put('/:id', validate(updateDoctorSchema), doctorController.updateDoctor);
router.delete('/:id', validate(idParamSchema), doctorController.deleteDoctor);

module.exports = router;
