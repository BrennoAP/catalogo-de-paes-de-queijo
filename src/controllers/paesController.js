import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const renderPaes = async (req, res) => {
  try {
    const paes = await prisma.pao.findMany({ where: { 
      deletedAt: null  
    },
    include: { padaria: true } 
  });
    res.render("index", { paes }); //
  } catch (err) {
    res.status(500).send("Erro ao carregar pães");
  }
};

export const createPao = async (req, res) => {
  const { name, preco, textura, descricao, padariaId } = req.body;
  try {
    const novoPao = await prisma.pao.create({
      data: {
        name,
        preco: parseFloat(preco),
        textura,
        descricao,
        padariaId: Number(padariaId),
        foto: req.file ? req.file.filename : null,
      },
    });

    // Renderiza a mesma página do form, passando a mensagem de sucesso
    const padarias = await prisma.padaria.findMany();
    res.render("paoForm", {
      padarias,
      mensagem: `Pão "${novoPao.name}" criado com sucesso!`,
    });
  } catch (err) {
    const padarias = await prisma.padaria.findMany({ where: { 
      deletedAt: null  
    }});
    res.render("paoForm", {
      padarias,
      mensagem: `Erro ao criar pão: ${err.message}`,
    });
  }
};




export const renderFormNovoPao = async (req, res) => {
  const padarias = await prisma.padaria.findMany({ where: { 
      deletedAt: null  
    }});
  res.render("paoForm", { title: "novo pao", padarias, mensagem: null });
};
export const renderHome = async (req, res) => {
  const { padariaId, textura, precoMin, precoMax } = req.query;

  // Função para garantir parse correto (vírgula -> ponto)
  const parsePreco = (val) => {
    if (!val) return undefined;
    return parseFloat(val.replace(',', '.'));
  };

  const filters = {};
  if (padariaId) filters.padariaId = Number(padariaId);
  if (textura) filters.textura = textura;

  const min = parsePreco(precoMin);
  const max = parsePreco(precoMax);

  if (min !== undefined || max !== undefined) {
    filters.preco = {};
    if (min !== undefined) filters.preco.gte = min;
    if (max !== undefined) filters.preco.lte = max;
  }

  let paes = [];
  if (Object.keys(req.query).length > 0) {
    paes = await prisma.pao.findMany({
    where: { 
      ...filters,
      deletedAt: null,  //só pegar os pães não deletados
    },
    include: { padaria: true },
    orderBy: { createdAt: "desc" },
  });
  }

  const padarias = await prisma.padaria.findMany();

  const texturasRaw = await prisma.pao.findMany({
    select: { textura: true },
    distinct: ["textura"],
    where: { 
      deletedAt: null  
    }
  });
  const texturas = texturasRaw.map((t) => t.textura).filter(Boolean);

  res.render("home", {
    paes,
    padarias,
    texturas,
    filtrosAtivos: req.query,
  });
};

export const listAllPaes = async (req, res) => {
  try {
    const pageSize = 6; // quantidade de pães por página
    const page = parseInt(req.query.page) || 1; // garante que seja número inteiro

    const { textura, minPreco, maxPreco, padariaId } = req.query;

    // Monta filtro dinâmico
    const where = {};
    if (textura) where.textura = textura;
    if (padariaId) where.padariaId = Number(padariaId);
    if (minPreco || maxPreco) where.preco = {};
    if (minPreco) where.preco.gte = parseFloat(minPreco);
    if (maxPreco) where.preco.lte = parseFloat(maxPreco);
    where.deletedAt = null;

    // Conta total de pães para paginação
    const totalPaes = await prisma.pao.count({ where });

    //pegar texturas distintas
  const texturasRaw = await prisma.pao.findMany({
    select: { textura: true },
    distinct: ["textura"],
  });

  const texturas = texturasRaw.map((t) => t.textura).filter(Boolean);

    // Busca os pães paginados
    const paes = await prisma.pao.findMany({
      where,
      include: { padaria: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    // Busca todas as padarias para o filtro
    const padarias = await prisma.padaria.findMany();

    const totalPages = Math.ceil(totalPaes / pageSize);

    res.render("listall", {
      paes,
      padarias,
      texturas,
      page,
      totalPages,
      //filtrosAtivos: req.query,
      query: req.query, // mantém filtros preenchidos no form
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar pães");
  }
};


export const softDeletePao = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.pao.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    const backUrl = req.get('Referer') || '/';
    res.redirect(backUrl); // volta para a página atual
  } catch (err) {
    res.status(404).send("Pão não encontrado");
  }
};


export const renderEditPao = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const pao = await prisma.pao.findUnique({ where: { id } });
    const padarias = await prisma.padaria.findMany();
    if (!pao) return res.status(404).send("Pão não encontrado");

    res.render("editPao", { pao, padarias });
  } catch (err) {
    res.status(500).send("Erro ao carregar pão");
  }
};

// Atualiza o pão e redireciona com alerta
export const updatePao = async (req, res) => {
  const id = Number(req.params.id);
  const { name, preco, textura, descricao, padariaId } = req.body;

  try {
    await prisma.pao.update({
      where: { id },
      data: {
        name,
        preco: parseFloat(preco),
        textura,
        descricao,
        padariaId: Number(padariaId),
      },
    });

    // Retorna script que mostra alerta e redireciona
    res.redirect("/success");
  } catch (err) {
    res.status(500).send("Erro ao atualizar pão");
  }
};

export const renderPaoSuccess = (req, res) => {
  res.render("sucessEdit", { message: "Pão editado com sucesso!" });
};