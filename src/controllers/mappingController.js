const { Mapping, Patient, Doctor } = require('../models');

/**
 * Assign a doctor to a patient owned by the logged-in user
 */
const createMapping = async (req, res, next) => {
  try {
    const { patientId, doctorId } = req.body;

    const patient = await Patient.findOne({
      where: { id: patientId, createdBy: req.user.id },
    });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    const existingMapping = await Mapping.findOne({
      where: { patientId, doctorId },
    });
    if (existingMapping) {
      return res.status(409).json({
        success: false,
        message: 'Doctor already assigned',
      });
    }

    const mapping = await Mapping.create({ patientId, doctorId });

    const fullMapping = await Mapping.findByPk(mapping.id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' },
      ],
    });

    return res.status(201).json({
      success: true,
      data: fullMapping,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all mappings for the logged-in user's patients
 */
const getMappings = async (req, res, next) => {
  try {
    const mappings = await Mapping.findAll({
      include: [
        {
          model: Patient,
          as: 'patient',
          where: { createdBy: req.user.id },
        },
        {
          model: Doctor,
          as: 'doctor',
        },
      ],
      order: [['id', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      data: mappings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all doctors assigned to a specific patient owned by the user
 */
const getDoctorsByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findOne({
      where: { id: patientId, createdBy: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const mappings = await Mapping.findAll({
      where: { patientId },
      include: [
        {
          model: Doctor,
          as: 'doctor',
        },
      ],
      order: [['id', 'ASC']],
    });

    const doctors = mappings.map((m) => m.doctor);

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a doctor-patient mapping if patient belongs to the user
 */
const deleteMapping = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mapping = await Mapping.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
        },
      ],
    });

    if (!mapping || !mapping.patient || mapping.patient.createdBy !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Mapping not found',
      });
    }

    await mapping.destroy();

    return res.status(200).json({
      success: true,
      message: 'Mapping deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMapping,
  getMappings,
  getDoctorsByPatient,
  deleteMapping,
};
