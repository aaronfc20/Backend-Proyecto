const { registrarCita } = require('../controllers/citasController'); // Ajusta la ruta según tu proyecto
const { Cita } = require('../models/Asociaciones');

// Mock del modelo Cita
jest.mock('../models/Asociaciones', () => ({
  Cita: {
    create: jest.fn(),
  },
}));

describe('registrarCita', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Debe registrar una cita exitosamente', async () => {
    Cita.create.mockResolvedValue({
      id: 1,
      pacienteId: 1,
      doctorId: 2,
      fecha: '2024-11-25',
      hora: '10:00',
      especialidad: 'Cardiología',
      sede: 'Clínica Central',
      tipoSeguro: 'Particular',
      metodoPago: 'efectivo',
    });

    const req = {
      body: {
        pacienteId: 1,
        doctorId: 2,
        fecha: '2024-11-25',
        hora: '10:00',
        especialidad: 'Cardiología',
        sede: 'Clínica Central',
        tipoSeguro: 'Particular',
        metodoPago: 'efectivo',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registrarCita(req, res);

    expect(Cita.create).toHaveBeenCalledWith({
      pacienteId: 1,
      doctorId: 2,
      fecha: '2024-11-25',
      hora: '10:00',
      especialidad: 'Cardiología',
      sede: 'Clínica Central',
      tipoSeguro: 'Particular',
      metodoPago: 'efectivo',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  test('Debe retornar error cuando falta la sede para citas presenciales', async () => {
    const req = {
      body: {
        pacienteId: 1,
        doctorId: 2,
        fecha: '2024-11-25',
        hora: '10:00',
        especialidad: 'Cardiología',
        tipoSeguro: 'Particular',
        metodoPago: 'efectivo',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registrarCita(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'El campo "sede" es obligatorio para citas presenciales.',
    });
  });

  test('Debe manejar errores del servidor al intentar registrar una cita', async () => {
    Cita.create.mockRejectedValue(new Error('Error de base de datos'));

    const req = {
      body: {
        pacienteId: 1,
        doctorId: 2,
        fecha: '2024-11-25',
        hora: '10:00',
        especialidad: 'Cardiología',
        sede: 'Clínica Central',
        tipoSeguro: 'Particular',
        metodoPago: 'efectivo',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registrarCita(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error al registrar la cita.',
      error: 'Error de base de datos',
    });
  });

  test('Debe retornar error cuando faltan datos obligatorios', async () => {
    const req = {
      body: {
        doctorId: 2, // Falta pacienteId
        fecha: '2024-11-25',
        hora: '10:00',
        especialidad: 'Cardiología',
        sede: 'Clínica Central',
        tipoSeguro: 'Particular',
        metodoPago: 'efectivo',
      },
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await registrarCita(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Faltan datos obligatorios para registrar la cita.',
    });
  });
});
