const { z } = require('zod');

// Helpers
const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID must be a numeric integer' }),
  }),
});

const patientIdParamSchema = z.object({
  params: z.object({
    patientId: z.string().regex(/^\d+$/, { message: 'patientId must be a numeric integer' }),
  }),
});

// Auth
const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }).min(1, 'name cannot be empty'),
    email: z.string({ required_error: 'email is required' }).email('Valid email is required'),
    password: z.string({ required_error: 'password is required' }).min(6, 'Password must be at least 6 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'email is required' }).email('Valid email is required'),
    password: z.string({ required_error: 'password is required' }).min(1, 'Password is required'),
  }),
});

// Patient
const createPatientSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }).min(1, 'name cannot be empty'),
    age: z.number({ required_error: 'age is required' }).int('age must be an integer').positive('age must be positive'),
    gender: z.string({ required_error: 'gender is required' }).min(1, 'gender cannot be empty'),
    phone: z.string({ required_error: 'phone is required' }).min(1, 'phone cannot be empty'),
    address: z.string({ required_error: 'address is required' }).min(1, 'address cannot be empty'),
    medicalHistory: z.string().optional(),
  }),
});

const updatePatientSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID must be a numeric integer' }),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    age: z.number().int().positive().optional(),
    gender: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    medicalHistory: z.string().optional(),
  }),
});

// Doctor
const createDoctorSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }).min(1, 'name cannot be empty'),
    specialization: z.string({ required_error: 'specialization is required' }).min(1, 'specialization cannot be empty'),
    email: z.string({ required_error: 'email is required' }).email('Valid email is required'),
    phone: z.string({ required_error: 'phone is required' }).min(1, 'phone cannot be empty'),
    experienceYears: z.number({ required_error: 'experienceYears is required' }).int('experienceYears must be an integer').nonnegative('experienceYears cannot be negative'),
  }),
});

const updateDoctorSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'ID must be a numeric integer' }),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    specialization: z.string().min(1).optional(),
    email: z.string().email('Valid email is required').optional(),
    phone: z.string().min(1).optional(),
    experienceYears: z.number().int().nonnegative().optional(),
  }),
});

// Mapping
const createMappingSchema = z.object({
  body: z.object({
    patientId: z.number({ required_error: 'patientId is required' }).int('patientId must be an integer'),
    doctorId: z.number({ required_error: 'doctorId is required' }).int('doctorId must be an integer'),
  }),
});

module.exports = {
  idParamSchema,
  patientIdParamSchema,
  registerSchema,
  loginSchema,
  createPatientSchema,
  updatePatientSchema,
  createDoctorSchema,
  updateDoctorSchema,
  createMappingSchema,
};
