CREATE DATABASE IF NOT EXISTS atendimento_medico
    USE atendimento_medico;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('medico', 'secretaria', 'paciente') NOT NULL,
    crm VARCHAR(20) NULL, #apenas médicos
    especialidade VARCHAR(60) NULL, #apenas médicos
    cpf CHAR(11) NULL UNIQUE, #apenas pacientes
    telefone INT(20) NULL, #apenas pacientes
);

CREATE TABLE consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    data_hora DATETIME NOT NULL,
    status ENUM('agendada','realizada','cancelada') NOT NULL DEFAULT 'agendada',
    observacoes TEXT NULL,
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id),
    FOREIGN KEY (medico_id)   REFERENCES usuarios(id),
    UNIQUE (medico_id, data_hora)
);