-- CreateTable
CREATE TABLE `empresas` (
    `id` VARCHAR(191) NOT NULL,
    `nomeEmpresarial` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logotipoUrl` VARCHAR(191) NULL,
    `fotografiaCapaUrl` VARCHAR(191) NULL,
    `segmentoAtuacao` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NULL,
    `descricaoInstitucional` TEXT NULL,
    `siteOficial` VARCHAR(191) NULL,
    `redesSociais` TEXT NULL,
    `contatos` TEXT NULL,
    `localizacao` TEXT NULL,
    `selosCertificacoes` TEXT NULL,
    `esg` TEXT NULL,
    `status` ENUM('ATIVA', 'INATIVA') NOT NULL DEFAULT 'ATIVA',
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `empresas_slug_key`(`slug`),
    INDEX `empresas_status_idx`(`status`),
    INDEX `empresas_cidade_idx`(`cidade`),
    INDEX `empresas_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
