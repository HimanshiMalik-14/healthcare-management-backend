const { Doctor } = require('../models');

/**
 * Create a new doctor record
 */
const createDoctor = async (req, res, next) => {
  try {
    const { name, specialization, email, phone, experienceYears } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingDoctor = await Doctor.findOne({ where: { email: normalizedEmail } });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'Doctor with this email already exists',
      });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      email: normalizedEmail,
      phone,
      experienceYears,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all doctor records
 */
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({
      order: [['id', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor details by ID
 */
const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update doctor details (creator only, else 403)
 */
const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    if (doctor.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update doctors created by you',
      });
    }

    const { name, specialization, email, phone, experienceYears } = req.body;

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await Doctor.findOne({ where: { email: normalizedEmail } });
      if (existing && existing.id !== doctor.id) {
        return res.status(409).json({
          success: false,
          message: 'Doctor with this email already exists',
        });
      }
      doctor.email = normalizedEmail;
    }

    if (name !== undefined) doctor.name = name;
    if (specialization !== undefined) doctor.specialization = specialization;
    if (phone !== undefined) doctor.phone = phone;
    if (experienceYears !== undefined) doctor.experienceYears = experienceYears;

    await doctor.save();

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete doctor record (creator only, else 403)
 */
const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    if (doctor.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete doctors created by you',
      });
    }

    await doctor.destroy();

    return res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
