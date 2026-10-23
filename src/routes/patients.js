const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createPatientSchema,
  updatePatientSchema,
  idParamSchema,
} = require('../middleware/schemas');

router.use(auth);

router.post('/', validate(createPatientSchema), patientController.createPatient);
router.get('/', patientController.getPatients);
router.get('/:id', validate(idParamSchema), patientController.getPatientById);
router.put('/:id', validate(updatePatientSchema), patientController.updatePatient);
router.delete('/:id', validate(idParamSchema), patientController.deletePatient);

module.exports = router;
