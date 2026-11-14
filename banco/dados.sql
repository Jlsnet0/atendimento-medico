use atendimento_medico;

INSERT INTO usuarios (nome, email, senha, perfil, crm, especialidade, cpf, telefone) VALUES
  ('Marta Oliveira', 'marta.secretaria@clinica.com', '123456', 'secretaria', NULL, NULL, NULL, NULL),
  ('Dr. Carlos Mendes', 'carlos.mendes@clinica.com', '123456', 'medico', 'CRM-PB 12345', 'Cardiologia', NULL, NULL),
  ('Dra. Helena Souza', 'helena.souza@clinica.com', '123456', 'medico', 'CRM-PB 23456', 'Pediatria', NULL, NULL),
  ('João Silva', 'joao.silva@email.com', '123456', 'paciente', NULL, NULL, '12345678909', '(83) 99999-0001'),
  ('Maria Santos', 'maria.santos@email.com', '123456', 'paciente', NULL, NULL, '23456789092', '(83) 99999-0002'),
  ('Pedro Lima', 'pedro.lima@email.com', '123456', 'paciente', NULL, NULL, '34567890175', '(83) 99999-0003');

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