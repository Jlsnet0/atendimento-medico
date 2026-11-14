package br.edu.unifacisa.atendimento.model;

import java.time.LocalDateTime;

public abstract class Usuario {

    private int id;
    private String nome;
    private String email;
    private String senha;
    private LocalDateTime criadoEm;
    
    public Usuario(String nome, String email, String senha) {
        setNome(nome);
        setEmail(email);
        setSenha(senha);
    }

    public abstract Perfil getPerfil();

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome é obrigatório");

        this.nome = nome.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || email.isBlank()) throw new IllegalArgumentException("Email -e obrigatório");

        if (!email.contains("@")) throw new IllegalArgumentException("Email inválido");

        this.email = email.trim().toLowerCase();
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        if (senha == null || senha.length() < 6) throw new IllegalArgumentException("A senha deve conter no mínimo 6 caracteres");

        this.senha = senha;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    @Override
    public String toString() {
        return "[" + getPerfil().getValor() + "] #" + id + " " + nome + " " + email;
    }

    
    

    
}
