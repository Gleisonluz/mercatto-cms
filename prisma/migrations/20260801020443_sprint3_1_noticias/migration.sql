-- CreateTable
CREATE TABLE `noticias` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `linhaFina` TEXT NULL,
    `resumo` TEXT NULL,
    `conteudo` LONGTEXT NOT NULL,
    `tipo` ENUM('NOTICIA', 'ARTIGO', 'ENTREVISTA', 'REPORTAGEM_ESPECIAL') NOT NULL DEFAULT 'NOTICIA',
    `status` ENUM('RASCUNHO', 'EM_EDICAO', 'REVISAO', 'AGUARDANDO_APROVACAO', 'AGENDADA', 'PUBLICADA', 'ARQUIVADA') NOT NULL DEFAULT 'RASCUNHO',
    `imagemDestaqueUrl` VARCHAR(191) NULL,
    `imagemDestaqueAlt` VARCHAR(191) NULL,
    `imagemDestaqueCredito` VARCHAR(191) NULL,
    `destaque` BOOLEAN NOT NULL DEFAULT false,
    `ordemDestaque` INTEGER NULL,
    `visualizacoes` INTEGER NOT NULL DEFAULT 0,
    `tempoLeituraMinutos` INTEGER NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `seoCanonicalUrl` VARCHAR(191) NULL,
    `publicadoEm` DATETIME(3) NULL,
    `agendadoPara` DATETIME(3) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,
    `editoriaId` VARCHAR(191) NOT NULL,
    `autorId` VARCHAR(191) NOT NULL,
    `editorResponsavelId` VARCHAR(191) NULL,

    UNIQUE INDEX `noticias_slug_key`(`slug`),
    INDEX `noticias_status_idx`(`status`),
    INDEX `noticias_editoriaId_idx`(`editoriaId`),
    INDEX `noticias_autorId_idx`(`autorId`),
    INDEX `noticias_editorResponsavelId_idx`(`editorResponsavelId`),
    INDEX `noticias_publicadoEm_idx`(`publicadoEm`),
    INDEX `noticias_destaque_ordemDestaque_idx`(`destaque`, `ordemDestaque`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NoticiasRelacionadas` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_NoticiasRelacionadas_AB_unique`(`A`, `B`),
    INDEX `_NoticiasRelacionadas_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `noticias` ADD CONSTRAINT `noticias_editoriaId_fkey` FOREIGN KEY (`editoriaId`) REFERENCES `editorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `noticias` ADD CONSTRAINT `noticias_autorId_fkey` FOREIGN KEY (`autorId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `noticias` ADD CONSTRAINT `noticias_editorResponsavelId_fkey` FOREIGN KEY (`editorResponsavelId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NoticiasRelacionadas` ADD CONSTRAINT `_NoticiasRelacionadas_A_fkey` FOREIGN KEY (`A`) REFERENCES `noticias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NoticiasRelacionadas` ADD CONSTRAINT `_NoticiasRelacionadas_B_fkey` FOREIGN KEY (`B`) REFERENCES `noticias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
