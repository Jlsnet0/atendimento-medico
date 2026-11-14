const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth');
const Usuario = require('../models/Usuario');
const Consulta = require('../models/Consulta');

// Authenticate all routes
router.use(authMiddleware);


// ==========================================
// RF02 - Schedule appointment
// POST /api/consultas
// Permission: Secretaria
// ==========================================

router.post('/', async (req, res) => {
    try {
        if (req.user.perfil !== 'secretaria') {
            return res.status(403).json({
                error: 'Permission denied'
            });
        }

        const { paciente_id, medico_id, data_hora } = req.body;

        if (!paciente_id || !medico_id || !data_hora) {
            return res.status(400).json({
                error: 'Paciente, médico and data_hora are required'
            });
        }

        const paciente = await Usuario.findById(paciente_id);
        const medico = await Usuario.findById(medico_id);

        if (!paciente || paciente.perfil !== 'paciente') {
            return res.status(400).json({
                error: 'Invalid patient'
            });
        }

        if (!medico || medico.perfil !== 'medico') {
            return res.status(400).json({
                error: 'Invalid doctor'
            });
        }

        if (isNaN(Date.parse(data_hora))) {
            return res.status(400).json({
                error: 'Invalid appointment date'
            });
        }

        const id = await Consulta.create({
            paciente_id,
            medico_id,
            data_hora,
            observacoes: null
        });

        res.status(201).json({
            message: 'Consulta agendada com sucesso',
            id
        });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'Doctor already has an appointment at this time'
            });
        }

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


// ==========================================
// RF03 - List appointments
// GET /api/consultas
//
// Secretaria: All appointments
// Médico: Own appointments
// Paciente: Own appointments
// ==========================================

router.get('/', async (req, res) => {
    try {
        let consultas;

        if (req.user.perfil === 'secretaria') {
            consultas = await Consulta.findAll();

        } else if (req.user.perfil === 'medico') {
            consultas = await Consulta.findByMedico(req.user.id);

        } else if (req.user.perfil === 'paciente') {
            consultas = await Consulta.findByPaciente(req.user.id);

        } else {
            return res.status(403).json({
                error: 'Permission denied'
            });
        }

        res.json(consultas);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


// ==========================================
// Reschedule appointment
// PATCH /api/consultas/:id/remarcar
// Permission: Secretaria
// ==========================================

router.patch('/:id/remarcar', async (req, res) => {
    try {
        if (req.user.perfil !== 'secretaria') {
            return res.status(403).json({
                error: 'Permission denied'
            });
        }

        const { data_hora } = req.body;

        if (!data_hora || isNaN(Date.parse(data_hora))) {
            return res.status(400).json({
                error: 'Valid data_hora is required'
            });
        }

        const consulta = await Consulta.findById(req.params.id);

        if (!consulta) {
            return res.status(404).json({
                error: 'Consulta não encontrada'
            });
        }

        if (consulta.status !== 'agendada') {
            return res.status(400).json({
                error: 'Only scheduled appointments can be rescheduled'
            });
        }

        await Consulta.update(req.params.id, {
            data_hora,
            observacoes: consulta.observacoes
        });

        res.json({
            message: 'Consulta remarcada com sucesso'
        });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'Doctor already has an appointment at this time'
            });
        }

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


// ==========================================
// Cancel appointment
// PATCH /api/consultas/:id/cancelar
// Permission: Secretaria
// ==========================================

router.patch('/:id/cancelar', async (req, res) => {
    try {
        if (req.user.perfil !== 'secretaria') {
            return res.status(403).json({
                error: 'Permission denied'
            });
        }

        const consulta = await Consulta.findById(req.params.id);

        if (!consulta) {
            return res.status(404).json({
                error: 'Consulta não encontrada'
            });
        }

        if (consulta.status !== 'agendada') {
            return res.status(400).json({
                error: 'Only scheduled appointments can be cancelled'
            });
        }

        await Consulta.updateStatus(req.params.id, 'cancelada');

        res.json({
            message: 'Consulta cancelada com sucesso'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


// ==========================================
// RF04 - Register appointment observations
// PATCH /api/consultas/:id/atendimento
// Permission: Médico (own appointments only)
// ==========================================

router.patch('/:id/atendimento', async (req, res) => {
    try {
        if (req.user.perfil !== 'medico') {
            return res.status(403).json({
                error: 'Permission denied'
            });
        }

        const { observacoes } = req.body;

        if (typeof observacoes !== 'string' || !observacoes.trim()) {
            return res.status(400).json({
                error: 'Observações are required'
            });
        }

        const consulta = await Consulta.findById(req.params.id);

        if (!consulta) {
            return res.status(404).json({
                error: 'Consulta não encontrada'
            });
        }

        if (Number(consulta.medico_id) !== Number(req.user.id)) {
            return res.status(403).json({
                error: 'You can only register observations for your own appointments'
            });
        }

        if (consulta.status !== 'agendada') {
            return res.status(400).json({
                error: 'Only scheduled appointments can receive attendance records'
            });
        }

        // Update observations and status
        await Consulta.updateStatus(req.params.id, 'realizada');

        await Consulta.update(req.params.id, {
            data_hora: consulta.data_hora,
            observacoes: observacoes.trim()
        });

        res.json({
            message: 'Atendimento registrado com sucesso'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


module.exports = router;