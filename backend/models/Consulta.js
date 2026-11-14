const db = require('../db.js');

const Consulta = {

    async findAll() {
        const [rows] = await db.query(`
            SELECT
                c.*,
                p.nome AS paciente_nome,
                m.nome AS medico_nome,
                m.especialidade AS medico_especialidade
            FROM consultas c
            INNER JOIN usuarios p ON c.paciente_id = p.id
            INNER JOIN usuarios m ON c.medico_id = m.id
        `);

        return rows;
    },

    async findById(id) {
        const [rows] = await db.query(`
            SELECT
                c.*,
                p.nome AS paciente_nome,
                m.nome AS medico_nome,
                m.especialidade AS medico_especialidade
            FROM consultas c
            INNER JOIN usuarios p ON c.paciente_id = p.id
            INNER JOIN usuarios m ON c.medico_id = m.id
            WHERE c.id = ?
        `, [id]);

        return rows[0] || null;
    },

    async findByPaciente(pacienteId) {
        const [rows] = await db.query(
            'SELECT * FROM consultas WHERE paciente_id = ?',
            [pacienteId]
        );

        return rows;
    },

    async findByMedico(medicoId) {
        const [rows] = await db.query(
            'SELECT * FROM consultas WHERE medico_id = ?',
            [medicoId]
        );

        return rows;
    },

    async create(consulta) {
        const {
            paciente_id,
            medico_id,
            data_hora,
            observacoes
        } = consulta;

        const [result] = await db.query(
            `INSERT INTO consultas
            (paciente_id, medico_id, data_hora, observacoes)
            VALUES (?, ?, ?, ?)`,
            [paciente_id, medico_id, data_hora, observacoes || null]
        );

        return result.insertId;
    },

    async updateStatus(id, status) {
        const [result] = await db.query(
            'UPDATE consultas SET status = ? WHERE id = ?',
            [status, id]
        );

        return result.affectedRows > 0;
    },

    async update(id, consulta) {
        const {
            data_hora,
            observacoes
        } = consulta;

        const [result] = await db.query(
            `UPDATE consultas SET
                data_hora = ?,
                observacoes = ?
            WHERE id = ?`,
            [data_hora, observacoes || null, id]
        );

        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await db.query(
            'DELETE FROM consultas WHERE id = ?',
            [id]
        );

        return result.affectedRows > 0;
    }

};

module.exports = Consulta;