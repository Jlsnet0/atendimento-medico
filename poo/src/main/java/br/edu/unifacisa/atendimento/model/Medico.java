package br.edu.unifacisa.atendimento.model;

public class Medico extends Usuario{

    private String crm;
    private String especialidade;
    
    public Medico(String nome, String email, String senha, String crm, String especialidade) {
        super(nome, email, senha);
        setCrm(crm);
        setEspecialidade(especialidade);
    }

    public String getCrm() {
        return crm;
    }

    public void setCrm(String crm) {
        if (crm == null || crm.isBlank()) throw new IllegalArgumentException("CRM é obrigatório");

        this.crm = crm.trim();
    }


    public String getEspecialidade() {
        return especialidade;
    }


    public void setEspecialidade(String especialidade) {
        if (especialidade == null || especialidade.isBlank()) throw new IllegalArgumentException("Especialidade é obrigatória");

        this.especialidade = especialidade.trim();
    }


    @Override
    public Perfil getPerfil() {
        return Perfil.MEDICO;
        
    }

    @Override
    public String toString() {
        return super.toString() + " | CRM " + crm + " | " + especialidade;
    }

    


}
