const db = require('../db.js');

const Usuario = {

    async findAll() {
        const [rows] = await db.query(
            'SELECT id, nome, email, perfil, crm, especialidade, cpf, telefone FROM usuarios'
        );

        return rows;
    },

    async findById(id) {
        const [rows] = await db.query(
            'SELECT id, nome, email, perfil, crm, especialidade, cpf, telefone FROM usuarios WHERE id = ?',
            [id]
        );

        return rows[0] || null;
    },

    async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        return rows[0] || null;
    },

    async create(usuario) {
        const {
            nome,
            email,
            senha,
            perfil,
            crm,
            especialidade,
            cpf,
            telefone
        } = usuario;

        const [result] = await db.query(
            `INSERT INTO usuarios
            (nome, email, senha, perfil, crm, especialidade, cpf, telefone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, email, senha, perfil, crm, especialidade, cpf, telefone]
        );

        return result.insertId;
    },

    async update(id, usuario) {
        const {
            nome,
            email,
            perfil,
            crm,
            especialidade,
            cpf,
            telefone
        } = usuario;

        const [result] = await db.query(
            `UPDATE usuarios SET
                nome = ?,
                email = ?,
                perfil = ?,
                crm = ?,
                especialidade = ?,
                cpf = ?,
                telefone = ?
            WHERE id = ?`,
            [nome, email, perfil, crm, especialidade, cpf, telefone, id]
        );

        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await db.query(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );

        return result.affectedRows > 0;
    }

};

module.exports = Usuario;