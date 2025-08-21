import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const renderPaes = async (req, res) => {
  try {
    const paes = await prisma.pao.findMany({ include: { padaria: true } });
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
    const padarias = await prisma.padaria.findMany();
    res.render("paoForm", {
      padarias,
      mensagem: `Erro ao criar pão: ${err.message}`,
    });
  }
};


export const renderFormNovoPao = async (req, res) => {
  const padarias = await prisma.padaria.findMany();
  res.render("paoForm", { title: "novo pao", padarias, mensagem: null });
};

export const renderHome = async (req, res) => {
  const { padariaId, textura, precoMin, precoMax } = req.query;

  // Construindo filtros dinamicamente
  const filters = {};
  if (padariaId) filters.padariaId = Number(padariaId);
  if (textura) filters.textura = textura;
  if (precoMin || precoMax) {
    filters.preco = {};
    if (precoMin) filters.preco.gte = parseFloat(precoMin);
    if (precoMax) filters.preco.lte = parseFloat(precoMax);
  }

  // Busca os pães filtrados
  let paes = [];
  // Só busca se algum filtro estiver definido
  if (Object.keys(req.query).length > 0) {
    paes = await prisma.pao.findMany({
      where: filters,
      include: { padaria: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Busca todas as padarias para o select
  const padarias = await prisma.padaria.findMany();

  // Busca todas as texturas únicas para o select
  const texturasRaw = await prisma.pao.findMany({
    select: { textura: true },
    distinct: ['textura'],
  });
  const texturas = texturasRaw.map(t => t.textura).filter(Boolean);

  res.render("home", { 
    paes, 
    padarias, 
    texturas,
    filtrosAtivos: req.query 
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

    // Conta total de pães para paginação
    const totalPaes = await prisma.pao.count({ where });

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
      page,
      totalPages,
      query: req.query, // mantém filtros preenchidos no form
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar pães");
  }
};
