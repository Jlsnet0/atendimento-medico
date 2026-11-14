package br.edu.unifacisa.atendimento.model;

public enum StatusConsulta {

    AGENDADA("agendada"),
    REALIZADA("realizada"),
    CANCELADA("cancelada");

    private final String valor;

    StatusConsulta(String valor){
        this.valor = valor;
    }

    public String getValor(){
        return valor;
    }

    public static StatusConsulta deTexto(String texto){
        for (StatusConsulta status : values()) {
            if (status.valor.equalsIgnoreCase(texto)) return status;
        }

        throw new IllegalArgumentException("Status inválido: " + texto);
    }
}
