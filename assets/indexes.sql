--
-- Extraindo dados da tabela `config`
--

INSERT INTO `config` (`SBT`) VALUES
('Y');

COMMIT;
--
-- Índices para tabela `estoque`
--
ALTER TABLE `estoque`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ESTOQUE_IDX1` (`IDEMPRESA`),
  ADD KEY `ESTOQUE_QUANTIDADE` (`QUANTIDADE`);

COMMIT;

ALTER TABLE `forma_pag` CHANGE `TIPO_DOCUMENTO` `TIPO_DOCUMENTO` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `fornecedores` CHANGE `ID` `ID` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `grupo` CHANGE `ID` `ID` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `param` CHANGE `ID` `ID` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `produtos` CHANGE `ID` `ID` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `produto_aliquota` CHANGE `ID` `ID` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `ajusteestoque` CHANGE `ID` `ID` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `lammer_lic` CHANGE `CODIGO` `CODIGO` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `movimento_est` CHANGE `ID` `ID` INT(11) NOT NULL AUTO_INCREMENT;

COMMIT;