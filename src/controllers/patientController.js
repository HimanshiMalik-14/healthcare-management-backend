const { Patient, Doctor } = require('../models');

/**
 * Create a new patient record for the logged-in user
 */
const createPatient = async (req, res, next) => {
  try {
    const { name, age, gender, phone, address, medicalHistory } = req.body;
    const patient = await Patient.create({
      name,
      age,
      gender,
      phone,
      address,
      medicalHistory: medicalHistory || null,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all patient records owned by the logged-in user
 */
const getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll({
      where: { createdBy: req.user.id },
      order: [['id', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get patient details with assigned doctors for owner
 */
const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({
      where: { id, createdBy: req.user.id },
      include: [
        {
          model: Doctor,
          as: 'doctors',
          through: { attributes: [] },
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a patient record owned by the logged-in user
 */
const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({
      where: { id, createdBy: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const { name, age, gender, phone, address, medicalHistory } = req.body;
    await patient.update({
      ...(name !== undefined && { name }),
      ...(age !== undefined && { age }),
      ...(gender !== undefined && { gender }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
      ...(medicalHistory !== undefined && { medicalHistory }),
    });

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a patient record owned by the logged-in user
 */
const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({
      where: { id, createdBy: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    await patient.destroy();

    return res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
