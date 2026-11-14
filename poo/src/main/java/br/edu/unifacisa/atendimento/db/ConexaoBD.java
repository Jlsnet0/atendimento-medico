package br.edu.unifacisa.atendimento.db;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class ConexaoBD {

    private ConexaoBD(){}

    public static Connection getConnection() throws SQLException {
        Properties props = new Properties();

        try (InputStream entrada = ConexaoBD.class.getClassLoader().getResourceAsStream("db.properties")){

            if (entrada == null) {
                throw new SQLException("Arquivo db.properties não encontrado. "
                + "Copie o db.properties.exemple e preencha a senha."
                );
            }

            props.load(entrada);
        } catch (IOException e) {
            throw new SQLException("Erro ao ler o db.properties" + e.getMessage(), e);
        }

        return DriverManager.getConnection(
            props.getProperty("db.url"),
            props.getProperty("db.usuario"),
            props.getProperty("db.senha"));
    }
}
