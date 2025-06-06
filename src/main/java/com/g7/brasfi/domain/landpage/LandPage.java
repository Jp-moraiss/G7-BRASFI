package com.g7.brasfi.domain.landpage;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "tb_landpage")
public class LandPage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(length = 500)
    private String tituloBrasfi;

    @Lob
    private String historiaBrasfi;

    @Lob
    private String hubProjetos;

    @Lob
    private String hubNetworking;

    @Lob
    private String recrutamento;

    @Lob
    private String questionario;
}
