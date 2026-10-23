const express = require('express');
const router = express.Router();
const mappingController = require('../controllers/mappingController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createMappingSchema,
  idParamSchema,
  patientIdParamSchema,
} = require('../middleware/schemas');

router.use(auth);

router.post('/', validate(createMappingSchema), mappingController.createMapping);
router.get('/', mappingController.getMappings);
router.get('/:patientId', validate(patientIdParamSchema), mappingController.getDoctorsByPatient);
router.delete('/:id', validate(idParamSchema), mappingController.deleteMapping);

module.exports = router;
