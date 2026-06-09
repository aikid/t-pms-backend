import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const leonardo = await prisma.user.findUnique({
    where: { email: 'leonardo.avallone@gmail.com' },
  });

  const leandro = await prisma.user.findUnique({
    where: { email: 'klonoa51@gmail.com' },
  });

  if (!leonardo || !leandro) {
    console.error('Gerentes não encontrados. Execute o seed após criar os gerentes.');
    process.exit(1);
  }

  const tenantId = leonardo.tenantId;
  const hash = await bcrypt.hash('senha123', 10);

  const teamLeonardo = [
    { name: 'Carlos Mendes', email: 'carlos.mendes@empresa.com', position: 'Eng. Software Jr.', area: 'DEV' },
    { name: 'Fernanda Lima', email: 'fernanda.lima@empresa.com', position: 'Eng. Software Pleno', area: 'DEV' },
    { name: 'Roberto Alves', email: 'roberto.alves@empresa.com', position: 'QA Engineer', area: 'DEV' },
    { name: 'Patrícia Costa', email: 'patricia.costa@empresa.com', position: 'Frontend Developer', area: 'DEV' },
    { name: 'Gustavo Rocha', email: 'gustavo.rocha@empresa.com', position: 'Backend Developer', area: 'DEV' },
  ];

  const teamLeandro = [
    { name: 'Mariana Souza', email: 'mariana.souza@empresa.com', position: 'Product Designer', area: 'DEV' },
    { name: 'Felipe Martins', email: 'felipe.martins@empresa.com', position: 'Eng. Software Jr.', area: 'DEV' },
    { name: 'Juliana Neves', email: 'juliana.neves@empresa.com', position: 'DevOps Engineer', area: 'DEV' },
    { name: 'André Barbosa', email: 'andre.barbosa@empresa.com', position: 'Eng. Software Pleno', area: 'DEV' },
    { name: 'Camila Ferreira', email: 'camila.ferreira@empresa.com', position: 'UX Researcher', area: 'DEV' },
  ];

  for (const u of teamLeonardo) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        tenantId,
        password: hash,
        role: 'EMPLOYEE',
        isSuperAdmin: false,
        isManager: false,
        managerId: leonardo.id,
        managerEmail: leonardo.email,
      },
    });
  }

  for (const u of teamLeandro) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        tenantId,
        password: hash,
        role: 'EMPLOYEE',
        isSuperAdmin: false,
        isManager: false,
        managerId: leandro.id,
        managerEmail: leandro.email,
      },
    });
  }

  console.log('Seed concluído: 10 colaboradores criados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
