package br.edu.unifacisa.atendimento.model;

public class Paciente extends Usuario{

    private String cpf;
    private String telefone;
    
    public Paciente(String nome, String email, String senha, String cpf, String telefone) {
        super(nome, email, senha);
        setCpf(cpf);
        setTelefone(telefone);
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        if (cpf == null || cpf.isBlank()) throw new IllegalArgumentException("CPF é obrigatório");
        
        String numeros = cpf.replaceAll("\\D", ""); // retira os pontos e traço do cpf

        if (numeros.length() != 11) throw new IllegalArgumentException("CPF deve conter 11 dígitos");

        if (numeros.matches("(\\d)\\1{10}")) throw new IllegalArgumentException("CPF inválido"); // capturar cpfs com todos os dígitos iguais

        int primeiroDigito = validarCPF(numeros, 9);
        int segundoDigito = validarCPF(numeros, 10);

        int digito1Informado = Character.getNumericValue(numeros.charAt(9));
        int digito2Informado = Character.getNumericValue(numeros.charAt(10));

        if (primeiroDigito != digito1Informado || segundoDigito != digito2Informado) {
            throw new IllegalArgumentException("CPF inválido");
        }
            
        this.cpf = numeros;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        if (telefone == null || telefone.isBlank()) {
            this.telefone = null;
            return;
        }

        String numeros = telefone.replaceAll("\\D", "");
        if (numeros.length() != 10 && numeros.length() != 11) throw new IllegalArgumentException("Telefone deve conter DDD e 8 ou 9 dígitos");
            
        this.telefone = numeros;
    }

    @Override
    public Perfil getPerfil() {
        return Perfil.PACIENTE;
    }

    @Override
    public String toString() {
        return super.toString() + " | CPF " + cpf;
    }

    private int validarCPF(String cpf, int quantidade){
        int soma = 0;

        for (int i = 0; i < quantidade; i++) {
            int digito = Character.getNumericValue(cpf.charAt(i));
            int peso = quantidade + 1 - i;

            soma += digito * peso;
        }

        int resto = soma % 11;
        
        return resto < 2 ? 0 : 11 - resto;
    }
}
