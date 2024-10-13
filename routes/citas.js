// commands/CreateCitaCommand.js
class CreateCitaCommand {
    constructor(citaData) {
        this.citaData = citaData;
    }

    async execute() {
        try {
            const nuevaCita = await Cita.create(this.citaData);
            return nuevaCita;
        } catch (error) {
            throw new Error('Error al crear la cita');
        }
    }
}

// Uso en routes/citas.js
router.post('/', async (req, res) => {
    const { fecha, hora, pacienteId, doctorId } = req.body;

    const createCitaCommand = new CreateCitaCommand({ fecha, hora, pacienteId, doctorId });

    try {
        const nuevaCita = await createCitaCommand.execute();
        res.status(201).json(nuevaCita);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


