START TRANSACTION;

-- --------------------------------------------------------

--
-- Estrutura da tabela `config`
--

CREATE TABLE `config` (
  `SBT` char(1) NOT NULL DEFAULT 'S'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `config`
--

INSERT INTO `config` (`SBT`) VALUES
('S');

-- --------------------------------------------------------

--
-- Estrutura da tabela `dash_produtos`
--

CREATE TABLE `dash_produtos` (
  `DESCRICAO` varchar(255) NOT NULL,
  `VLUNIT` double NOT NULL,
  `VLTOTAL` double NOT NULL,
  `QTD` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `forma_pag`
--

CREATE TABLE `forma_pag` (
  `TIPO_DOCUMENTO` int(11) NOT NULL,
  `DESCRICAO` varchar(20) NOT NULL,
  `QTD` int(11) NOT NULL,
  `TOTVENDA` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- Estrutura da tabela `fornecedores`
--

CREATE TABLE `fornecedores` (
  `ID` int(11) NOT NULL,
  `ATIVO` char(1) DEFAULT NULL,
  `TIPO_FJ` char(1) DEFAULT NULL,
  `NOME` varchar(50) DEFAULT NULL,
  `ENDERECO` varchar(100) DEFAULT NULL,
  `NUMERO` varchar(10) DEFAULT NULL,
  `BAIRRO` varchar(20) DEFAULT NULL,
  `CIDADE` varchar(20) DEFAULT NULL,
  `CEP` varchar(10) DEFAULT NULL,
  `TELEFONE` varchar(12) DEFAULT NULL,
  `CELULAR` varchar(12) DEFAULT NULL,
  `CNPJ_CPF` varchar(20) DEFAULT NULL,
  `INSC_RG` varchar(20) DEFAULT NULL,
  `DATALANCAMENTO` datetime DEFAULT NULL,
  `CONTATO` varchar(512) DEFAULT NULL,
  `OBSERVACOES` varchar(512) DEFAULT NULL,
  `COMPLEMENTO` varchar(512) DEFAULT NULL,
  `UF` varchar(2) DEFAULT NULL,
  `SITE` varchar(200) DEFAULT NULL,
  `EMAIL` varchar(200) DEFAULT NULL,
  `CODCIDADE` varchar(7) DEFAULT NULL,
  `SINCRONIZADO` char(1) DEFAULT 'N',
  `TEMPOENTREGA` int(11) DEFAULT NULL,
  `DATA_ULTIMA_ALTERACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `MD5` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `grupo`
--

CREATE TABLE `grupo` (
  `ID` int(11) NOT NULL,
  `DESCRICAO` varchar(256) DEFAULT NULL,
  `ATIVO` char(1) DEFAULT NULL,
  `ATIVO_VENDA` char(1) NOT NULL,
  `ICMS_POR_DENTRO` char(1) DEFAULT 'N',
  `SINCRONIZADO` char(1) NOT NULL DEFAULT 'N',
  `DATA_ULTIMA_ALTERACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `MD5` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `grupo_venda`
--

CREATE TABLE `grupo_venda` (
  `IDGRUPO` int(11) NOT NULL,
  `DESCRICAO` varchar(255) NOT NULL,
  `QUANTIDADE` double DEFAULT NULL,
  `TOTAL` double DEFAULT NULL,
  `TOTCUSTO` double DEFAULT NULL,
  `TOTLUCRO` double NOT NULL,
  `SINCRONIZADO` char(1) NOT NULL DEFAULT 'S',
  `DATA_ULTIMA_ALTERACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `MD5` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `lammer_lic`
--

CREATE TABLE `lammer_lic` (
  `CODIGO` int(11) NOT NULL,
  `CNPJ_EMPRESA` varchar(14) NOT NULL,
  `ID_TERMINAL` varchar(20) NOT NULL,
  `DATA_ATIVACAO` varchar(10) DEFAULT NULL,
  `DIAS_RESET` varchar(5) DEFAULT NULL,
  `ULTIMO_ACESSO` varchar(20) DEFAULT NULL,
  `ULTIMO_SERIAL` varchar(50) DEFAULT NULL,
  `DATA_VENCIMENTO` varchar(10) DEFAULT NULL,
  `DATA_PAGAMENTO` varchar(10) DEFAULT NULL,
  `DATA_ULTIMA_ALTERACAO` timestamp NOT NULL DEFAULT current_timestamp(),
  `MD5` varchar(100) NOT NULL,
  `SINCRONIZADO` char(1) DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `movimento_est`
--

CREATE TABLE `movimento_est` (
  `ID` int(11) NOT NULL,
  `IDPRODUTO` int(11) DEFAULT NULL,
  `QUANTIDADE` double DEFAULT NULL,
  `DATALANCAMENTO` datetime DEFAULT NULL,
  `TIPOMOVIMENTO` int(11) DEFAULT NULL,
  `IDEMPRESA` int(11) NOT NULL,
  `ORIGEMMOV` int(11) DEFAULT NULL,
  `IDCAIXA` int(11) DEFAULT NULL,
  `IDPEDIDO` int(11) DEFAULT NULL,
  `IDUSUARIO` int(11) DEFAULT NULL,
  `USUARIO` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `param`
--

CREATE TABLE `param` (
  `ID` int(11) NOT NULL,
  `NAME` varchar(64) NOT NULL,
  `VALUE` varchar(64) DEFAULT NULL,
  `DESCRICAO` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabela de parametrizacao';

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos`
--

CREATE TABLE `produtos` (
  `ID` int(11) NOT NULL,
  `DESCRICAO` varchar(90) NOT NULL,
  `EAN13` varchar(13) DEFAULT NULL,
  `GRUPO` int(11) DEFAULT NULL,
  `UNIDADE` varchar(3) DEFAULT NULL,
  `ALIQUOTA_ICMS` double DEFAULT NULL,
  `ALIQUOTA_IPI` double DEFAULT NULL,
  `PRECO_COMPRA` double DEFAULT NULL,
  `PRECO_VENDA` double DEFAULT NULL,
  `TIPOPROD` int(11) DEFAULT 0,
  `PERC_COM` double DEFAULT NULL,
  `ATIVO` char(1) NOT NULL,
  `TIPO_PRODUTO` int(11) DEFAULT NULL,
  `MARGEM_LUCRO` double DEFAULT NULL,
  `CONTROLAR_ESTOQUE` char(1) NOT NULL,
  `EDITA_DESC_PED` char(1) NOT NULL,
  `TRIBUTACAO` int(11) DEFAULT NULL,
  `FRACIONADO` char(1) DEFAULT NULL,
  `CODIGO_NCM` varchar(8) NOT NULL,
  `COMBUSTIVEL` char(1) DEFAULT 'N',
  `IPPT` char(1) DEFAULT NULL,
  `IAT` char(1) DEFAULT NULL,
  `SINCRONIZADO` char(1) DEFAULT 'N',
  `EXCECAO_NCM` int(11) DEFAULT NULL,
  `CST_INTERNO` varchar(3) DEFAULT NULL,
  `CFOP_INTERNO` varchar(4) DEFAULT NULL,
  `BENS_CONSUMO` char(1) NOT NULL DEFAULT 'N',
  `PROD_COMPONENTE` char(1) NOT NULL DEFAULT 'N',
  `PESAVEL` char(1) NOT NULL,
  `USA_FECOEP` char(1) DEFAULT NULL,
  `ORIGEM` int(11) DEFAULT 0,
  `CSOSN` varchar(3) DEFAULT '500',
  `CFOP_DENTRO_UF` int(11) DEFAULT 5102,
  `CFOP_FORA_UF` int(11) DEFAULT 6102,
  `ID_FORNECEDOR` int(11) DEFAULT NULL,
  `NUTRI_VALIDADE` int(11) DEFAULT NULL,
  `IMPRESSAOREMOTA` char(1) DEFAULT NULL,
  `MOVCOMPOSTO` char(1) DEFAULT NULL,
  `PROD_FINALIDADE` varchar(250) DEFAULT NULL,
  `MOVCOMPONENTE` char(1) DEFAULT NULL,
  `DATA_ULTIMA_ALTERACAO` datetime DEFAULT NULL,
  `DATA_CADASTRO` datetime DEFAULT current_timestamp(),
  `VENDACONTROLADA` varchar(1) DEFAULT NULL,
  `ESTOQUEMINIMO` double DEFAULT NULL,
  `PERC_DESC` double DEFAULT NULL,
  `ATIVARDESCONTO` varchar(1) DEFAULT NULL,
  `IDFAMILIA` int(11) DEFAULT NULL,
  `QUANT_CAIXA` double DEFAULT NULL,
  `ESTOQUE` double DEFAULT NULL,
  `ATIVOPDV` char(1) DEFAULT NULL,
  `MD5` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Estrutura da tabela `produto_aliquota`
--

CREATE TABLE `produto_aliquota` (
  `ID` int(11) NOT NULL,
  `IDPRODUTO` int(11) DEFAULT NULL,
  `UF` varchar(2) DEFAULT NULL,
  `CST` varchar(3) DEFAULT NULL,
  `CFOP` varchar(4) DEFAULT NULL,
  `ALIQUOTA` double DEFAULT NULL,
  `REDUCAO_BASE` double DEFAULT NULL,
  `ALIQUOTA_FECOEP` double DEFAULT NULL,
  `ALIQUOTA_UF` decimal(14,4) DEFAULT NULL,
  `ALIQUOTA_ST` decimal(14,4) DEFAULT NULL,
  `MVA_ST` decimal(14,4) DEFAULT NULL,
  `REDUCAO_ST` decimal(14,4) DEFAULT NULL,
  `DATA_ULTIMA_ALTERACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `MD5` varchar(100) NOT NULL,
  `SINCRONIZADO` char(1) DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `unidades`
--

CREATE TABLE `unidades` (
  `ID` int(11) NOT NULL,
  `DESCRICAO` varchar(6) DEFAULT NULL,
  `TIPOUN` int(11) DEFAULT NULL,
  `DATA_ULTIMA_ALTERACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `MD5` varchar(100) NOT NULL,
  `SINCRONIZADO` char(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `ajusteestoque`
--

CREATE TABLE `ajusteestoque` (
  `ID` int(11) NOT NULL,
  `DATALANCAMENTO` datetime DEFAULT NULL,
  `TIPONOTA` int(11) DEFAULT NULL,
  `MODELONOTA` int(11) DEFAULT NULL,
  `DATALANCNOTA` datetime DEFAULT NULL,
  `IDFORNECEDOR` int(11) DEFAULT NULL,
  `FORNECEDOR` varchar(512) DEFAULT NULL,
  `NUMNOTA` varchar(256) DEFAULT NULL,
  `IDTIPOMOVIMENTO` int(11) DEFAULT NULL,
  `TIPOMOVIMENTO` varchar(256) DEFAULT NULL,
  `IDFUNCIONARIO` int(11) DEFAULT NULL,
  `FUNCIONARIO` varchar(512) DEFAULT NULL,
  `CANCELADO` varchar(1) DEFAULT NULL,
  `IDCANCELADO` int(11) DEFAULT NULL,
  `DATACANCELADO` datetime DEFAULT NULL,
  `OBSERVACAO` varchar(512) DEFAULT NULL,
  `NUMDOC` varchar(128) DEFAULT NULL,
  `LIBERARVOUCHER` varchar(1) DEFAULT NULL,
  `IDAUTORIZADOR` int(11) DEFAULT NULL,
  `NOMEAUTORIZADOR` varchar(512) DEFAULT NULL,
  `DATAAUTORIZACAO` datetime DEFAULT NULL,
  `DATAUTILIZACAOVOUCHER` datetime DEFAULT NULL,
  `VALORNOTACOMPRA` double DEFAULT NULL,
  `VALORNOTAVENDA` double DEFAULT NULL,
  `LANCCONCLUIDO` char(1) DEFAULT NULL,
  `DATA_ULTIMA_ALTERACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `MD5` varchar(100) DEFAULT NULL,
  `SINCRONIZADO` char(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `ajusteestoqueitens`
--

CREATE TABLE `ajusteestoqueitens` (
  `ID` int(11) NOT NULL,
  `IDAJUSTE` int(11) DEFAULT NULL,
  `DATALANCAMENTO` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `NUMITEM` int(11) DEFAULT NULL,
  `IDPRODUTO` int(11) DEFAULT NULL,
  `EANPRODUTO` varchar(14) DEFAULT NULL,
  `DESCRICAO` varchar(512) DEFAULT NULL,
  `PRECOCOMPRAUNITARIO` double DEFAULT NULL,
  `QUANTIDADE` double DEFAULT NULL,
  `VALORTOTALCOMPRA` double DEFAULT NULL,
  `PRECOCOMPRA` double DEFAULT NULL,
  `VALORTOTALVENDA` double DEFAULT NULL,
  `PRECOVENDA` double DEFAULT NULL,
  `MARGEMLUCRO` double DEFAULT NULL,
  `NCM` varchar(8) DEFAULT NULL,
  `CST` varchar(3) DEFAULT NULL,
  `CFOP` varchar(4) DEFAULT NULL,
  `CEST` varchar(7) DEFAULT NULL,
  `IDFORNECEDOR` int(11) DEFAULT NULL,
  `FORNECEDOR` varchar(512) DEFAULT NULL,
  `DATACOMPRA` datetime NOT NULL DEFAULT current_timestamp(),
  `AJUSTELANCADO` char(1) DEFAULT NULL,
  `QUANTCAIXA` double DEFAULT NULL,
  `QUANTTOTAL` double DEFAULT NULL,
  `VALORUNITARIO` double DEFAULT NULL,
  `ESTOQUEATUAL` double DEFAULT NULL,
  `DATA_ULTIMA_ALTERACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `MD5` varchar(100) DEFAULT NULL,
  `SINCRONIZADO` char(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `ajusteestoquenotas`
--

CREATE TABLE `ajusteestoquenotas` (
  `ID` int(11) NOT NULL,
  `IDAJUSTEESTOQUE` int(11) NOT NULL,
  `LANCAMENTO` datetime NOT NULL DEFAULT current_timestamp(),
  `NUMNOTA` varchar(32) NOT NULL,
  `CHAVENOTA` varchar(44) NOT NULL,
  `CNPJCPFFORNECEDOR` varchar(14) NOT NULL,
  `FORNECEDOR` varchar(256) NOT NULL,
  `VALORNOTA` double NOT NULL,
  `LANCADA` char(1) NOT NULL,
  `CANCELADA` char(1) NOT NULL,
  `DATA_ULTIMA_ALTERACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `MD5` varchar(100) NOT NULL,
  `SINCRONIZADO` char(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Estrutura da tabela `classificacao`
--

CREATE TABLE `classificacao` (
  `ID` int(11) NOT NULL,
  `DESCRICAO` varchar(512) DEFAULT NULL,
  `TIPO` int(11) DEFAULT NULL,
  `TIPO_MOVIMENTO` int(11) DEFAULT NULL,
  `BAIXAR_ESTOQUE` char(1) DEFAULT NULL,
  `GERAR_MOVIMENTO` char(1) DEFAULT NULL,
  `MODELO` varchar(2) DEFAULT NULL,
  `SERIE` char(1) DEFAULT NULL,
  `DEVOLUCAO` char(1) DEFAULT NULL,
  `NATOP` varchar(250) DEFAULT NULL,
  `APROPRIAR_ICMS_AP` char(1) NOT NULL DEFAULT 'N',
  `DATA_ULTIMA_ALTERACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `MD5` varchar(100) NOT NULL,
  `SINCRONIZADO` char(1) NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `estoque`
--

CREATE TABLE `estoque` (
  `ID` int(11) NOT NULL,
  `IDEMPRESA` int(11) DEFAULT NULL,
  `IDPRODUTO` int(11) NOT NULL,
  `QUANTIDADE` double NOT NULL,
  `MD5REGISTRO` varchar(32) DEFAULT NULL,
  `DATA_ULTIMA_ALTERACAO` datetime NOT NULL DEFAULT current_timestamp(),
  `SINCRONIZADO` char(1) NOT NULL,
  `MD5` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `pedido_itens`
--

CREATE TABLE `pedido_itens` (
  `EAN13` varchar(15) NOT NULL,
  `DESCRICAO` varchar(512) NOT NULL,
  `QUANTIDADE` double NOT NULL,
  `VALOR_TOTAL` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `forma_pag`
--
ALTER TABLE `forma_pag`
  ADD PRIMARY KEY (`TIPO_DOCUMENTO`),
  ADD UNIQUE KEY `DESCRICAO` (`DESCRICAO`);

--
-- Índices para tabela `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `ID` (`ID`);

--
-- Índices para tabela `grupo_venda`
--
ALTER TABLE `grupo_venda`
  ADD UNIQUE KEY `IDGRUPO` (`IDGRUPO`);

--
-- Índices para tabela `lammer_lic`
--
ALTER TABLE `lammer_lic`
  ADD PRIMARY KEY (`CODIGO`),
  ADD UNIQUE KEY `CODIGO` (`CODIGO`);

--
-- Índices para tabela `movimento_est`
--
ALTER TABLE `movimento_est`
  ADD PRIMARY KEY (`ID`);

--
-- Índices para tabela `param`
--
ALTER TABLE `param`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `NAME` (`NAME`);


--
-- Índices para tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`ID`);

--
-- Índices para tabela `produto_aliquota`
--
ALTER TABLE `produto_aliquota`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `forma_pag`
--
ALTER TABLE `forma_pag`
  MODIFY `TIPO_DOCUMENTO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de tabela `grupo`
--
ALTER TABLE `grupo`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de tabela `lammer_lic`
--
ALTER TABLE `lammer_lic`
  MODIFY `CODIGO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de tabela `movimento_est`
--
ALTER TABLE `movimento_est`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de tabela `param`
--
ALTER TABLE `param`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de tabela `produto_aliquota`
--
ALTER TABLE `produto_aliquota`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

--
-- Índices para tabela `estoque`
--
ALTER TABLE `estoque`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ESTOQUE_IDX1` (`IDEMPRESA`),
  ADD KEY `ESTOQUE_QUANTIDADE` (`QUANTIDADE`);