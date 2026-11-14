use atendimento_medico;

-- Marta Oliveira (Secretaria)
UPDATE usuarios
SET telefone = '(83) 99999-0000'
WHERE email = 'marta.secretaria@clinica.com';


-- Dr. Carlos Mendes (Médico)
UPDATE usuarios
SET
    crm = 'CRM-PB 12345',
    especialidade = 'Cardiologia',
    telefone = '(83) 99999-0004'
WHERE email = 'carlos.mendes@clinica.com';


-- Dra. Helena Souza (Médica)
UPDATE usuarios
SET
    crm = 'CRM-PB 23456',
    especialidade = 'Pediatria',
    telefone = '(83) 99999-0005'
WHERE email = 'helena.souza@clinica.com';


-- João Silva (Paciente)
UPDATE usuarios
SET
    cpf = '12345678901',
    telefone = '(83) 99999-0001'
WHERE email = 'joao.silva@email.com';


-- Maria Santos (Paciente)
UPDATE usuarios
SET
    cpf = '23456789012',
    telefone = '(83) 99999-0002'
WHERE email = 'maria.santos@email.com';


-- Pedro Lima (Paciente)
UPDATE usuarios
SET
    cpf = '34567890123',
    telefone = '(83) 99999-0003'
WHERE email = 'pedro.lima@email.com';

INSERT INTO consultas (paciente_id, medico_id, data_hora, status, observacoes) VALUES
  ((SELECT id FROM usuarios WHERE email = 'joao.silva@email.com'),
   (SELECT id FROM usuarios WHERE email = 'carlos.mendes@clinica.com'),
   '2026-11-23 09:00:00', 'agendada', NULL),
  ((SELECT id FROM usuarios WHERE email = 'maria.santos@email.com'),
   (SELECT id FROM usuarios WHERE email = 'carlos.mendes@clinica.com'),
   '2026-11-23 10:00:00', 'agendada', NULL),
  ((SELECT id FROM usuarios WHERE email = 'pedro.lima@email.com'),
   (SELECT id FROM usuarios WHERE email = 'helena.souza@clinica.com'),
   '2026-11-10 08:30:00', 'realizada', 'Consulta de rotina. Sem alterações.'),
  ((SELECT id FROM usuarios WHERE email = 'joao.silva@email.com'),
   (SELECT id FROM usuarios WHERE email = 'helena.souza@clinica.com'),
   '2026-11-25 15:00:00', 'cancelada', 'Cancelada a pedido do paciente.');