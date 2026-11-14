package br.edu.unifacisa.atendimento;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import br.edu.unifacisa.atendimento.db.ConexaoBD;
import br.edu.unifacisa.atendimento.model.Consulta;
import br.edu.unifacisa.atendimento.model.Medico;
import br.edu.unifacisa.atendimento.model.Paciente;
import br.edu.unifacisa.atendimento.model.Perfil;
import br.edu.unifacisa.atendimento.model.Secretaria;
import br.edu.unifacisa.atendimento.model.StatusConsulta;
import br.edu.unifacisa.atendimento.model.Usuario;

public class Main {

    public static void main(String[] args) {
        
        try (Connection conexao = ConexaoBD.getConnection()) {
            System.out.println("Conexão com o banco realizada");

            Map<Integer, Usuario> usuarios = lerUsuarios(conexao);
            System.out.println("USUÁRIOS:");
            for (Usuario user : usuarios.values()) {
                System.out.println(user.getPerfil() + " - " + user);
            }

            List<Consulta> consultas = lerConsultas(conexao, usuarios);
            System.out.println("CONSULTAS:");
            for (Consulta consulta : consultas) {
                System.out.println(consulta);
            }

        } catch (SQLException e) {
            System.out.println("Erro ao conectar ou ler o banco: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("Dado inválido no banco: " + e.getMessage());
        }
    }

    private static Map<Integer, Usuario> lerUsuarios(Connection conexao) throws SQLException {
        Map<Integer, Usuario> usuarios = new LinkedHashMap<>();
        String sql = "SELECT id, nome, email, senha, perfil, crm, especialidade, cpf, telefone, criado_em " 
                    + "FROM usuarios ORDER BY id";
        
        try (PreparedStatement st = conexao.prepareStatement(sql); ResultSet rs = st.executeQuery()) {
            
            while (rs.next()) {
                Usuario user = criarUsuario(rs);
                user.setId(rs.getInt("id"));
                user.setCriadoEm(rs.getTimestamp("criado_em").toLocalDateTime());
                usuarios.put(user.getId(), user);
            }
        }
        
        return usuarios;
    }

    private static Usuario criarUsuario(ResultSet rs) throws SQLException {
        Perfil perfil = Perfil.deTexto(rs.getString("perfil"));
        String nome = rs.getString("nome");
        String email = rs.getString("email");
        String senha = rs.getString("senha");

        return switch(perfil) {
            case MEDICO -> new Medico(nome, email, senha, rs.getString("crm"), rs.getString("especialidade"));
            case SECRETARIA -> new Secretaria(nome, email, senha);
            case PACIENTE -> new Paciente(nome, email, senha, rs.getString("cpf"), rs.getString("telefone"));
        };
    }

    private static List<Consulta> lerConsultas(Connection conexao, Map<Integer, Usuario> usuarios)
            throws SQLException {
        List<Consulta> consultas = new ArrayList<>();
        String sql = "SELECT id, paciente_id, medico_id, data_hora, status, observacoes "
                + "FROM consultas ORDER BY data_hora";

        try (PreparedStatement ps = conexao.prepareStatement(sql);
            ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Usuario p = usuarios.get(rs.getInt("paciente_id"));
                Usuario m = usuarios.get(rs.getInt("medico_id"));

                if (p instanceof Paciente paciente && m instanceof Medico medico) {
                    Consulta c = new Consulta(paciente, medico,
                    rs.getTimestamp("data_hora").toLocalDateTime());
                    c.setId(rs.getInt("id"));
                    c.setStatus(StatusConsulta.deTexto(rs.getString("status")));
                    c.setObservacoes(rs.getString("observacoes"));
                    consultas.add(c);
                }
            }
        }
        return consultas;
    }
}
