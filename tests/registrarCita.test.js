const { registrarCita } = require('../controllers/citasController');
const { Cita } = require('../models/Asociaciones');

jest.mock('../models/Asociaciones', () => ({
  Cita: {
    create: jest.fn(),
  },
}));

describe('Citas Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registrarCita', () => {
    test('Debe registrar una cita exitosamente', async () => {
      const req = {
        body: {
          pacienteId: 1,
          doctorId: 2,
          fecha: '2024-11-30',
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

      const mockCita = {
        id: 1,
        pacienteId: 1,
        doctorId: 2,
        fecha: '2024-11-30',
        hora: '10:00',
        especialidad: 'Cardiología',
        sede: 'Clínica Central',
        tipoSeguro: 'Particular',
        metodoPago: 'efectivo',
      };

      Cita.create.mockResolvedValue(mockCita);

      await registrarCita(req, res);

      expect(Cita.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cita registrada exitosamente.',
        cita: mockCita,
      });
    });

    test('Debe retornar error cuando falta la sede para citas presenciales', async () => {
        const req = {
          body: {
            pacienteId: 1,
            doctorId: 2,
            fecha: '2024-11-30',
            hora: '10:00',
            especialidad: 'Cardiología',
            tipoSeguro: 'Particular',
            metodoPago: 'efectivo', // Metodo que requiere sede
            // Falta el campo "sede"
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

    test('Debe retornar error si faltan datos obligatorios', async () => {
      const req = {
        body: {
          doctorId: 2,
          fecha: '2024-11-30',
          hora: '10:00',
          especialidad: 'Cardiología',
          tipoSeguro: 'Particular',
          metodoPago: 'efectivo',
        }, // Falta pacienteId
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

    test('Debe manejar errores del servidor', async () => {
      const req = {
        body: {
          pacienteId: 1,
          doctorId: 2,
          fecha: '2024-11-30',
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

      Cita.create.mockRejectedValue(new Error('Error al crear cita'));

      await registrarCita(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al registrar la cita.',
        error: 'Error al crear cita',
      });
    });
  });
});
