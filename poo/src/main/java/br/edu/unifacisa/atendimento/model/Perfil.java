package br.edu.unifacisa.atendimento.model;

public enum Perfil {

    MEDICO("medico"),
    SECRETARIA("secretaria"),
    PACIENTE("paciente");

    private final String valor;

    Perfil(String valor){
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static Perfil deTexto (String texto){
        for (Perfil perfil : values()) {
            if (perfil.valor.equalsIgnoreCase(texto)) return perfil;
        }
        
        throw new IllegalArgumentException("Perfil inválido: " + texto);
    }
}
