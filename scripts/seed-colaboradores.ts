import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const TENANT_ID = 'f154e4b9-7805-4bd1-b0b1-43ba1c850357';

async function main() {
  const managers = await prisma.user.findMany({
    where: { tenantId: TENANT_ID, isManager: true },
    select: { id: true, name: true, email: true },
  });

  if (managers.length === 0) {
    console.error('Nenhum gestor encontrado. Criando colaboradores sem gestor.');
  } else {
    console.log('Gestores encontrados:', managers.map((m) => m.name).join(', '));
  }

  const manager1 = managers[0] ?? null;
  const manager2 = managers[1] ?? manager1;

  const hash = await bcrypt.hash('senha123', 10);

  const colaboradores = [
    { name: 'Ana Paula Ribeiro',   email: 'ana.ribeiro@empresa.com',    position: 'Analista de RH',          area: 'RH',         manager: manager1 },
    { name: 'Bruno Carvalho',      email: 'bruno.carvalho@empresa.com',  position: 'Eng. Software Pleno',     area: 'DEV',        manager: manager1 },
    { name: 'Camila Torres',       email: 'camila.torres@empresa.com',   position: 'Designer UX',             area: 'PRODUTO',    manager: manager1 },
    { name: 'Diego Nascimento',    email: 'diego.nascimento@empresa.com',position: 'Analista Financeiro',     area: 'FINANCEIRO', manager: manager1 },
    { name: 'Érica Monteiro',      email: 'erica.monteiro@empresa.com',  position: 'QA Engineer',             area: 'DEV',        manager: manager1 },
    { name: 'Fábio Andrade',       email: 'fabio.andrade@empresa.com',   position: 'Backend Developer',       area: 'DEV',        manager: manager2 },
    { name: 'Gabriela Sousa',      email: 'gabriela.sousa@empresa.com',  position: 'Product Manager',         area: 'PRODUTO',    manager: manager2 },
    { name: 'Henrique Lima',       email: 'henrique.lima@empresa.com',   position: 'DevOps Engineer',         area: 'DEV',        manager: manager2 },
    { name: 'Isabela Freitas',     email: 'isabela.freitas@empresa.com', position: 'Analista de Marketing',   area: 'MARKETING',  manager: manager2 },
    { name: 'João Victor Pires',   email: 'joao.pires@empresa.com',      position: 'Eng. Software Jr.',       area: 'DEV',        manager: manager2 },
  ];

  let created = 0;
  let skipped = 0;

  for (const c of colaboradores) {
    const existing = await prisma.user.findUnique({ where: { email: c.email } });
    if (existing) {
      console.log(`  Já existe: ${c.email}`);
      skipped++;
      continue;
    }

    await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        position: c.position,
        area: c.area,
        tenantId: TENANT_ID,
        password: hash,
        role: 'EMPLOYEE',
        isSuperAdmin: false,
        isManager: false,
        managerId: c.manager?.id ?? null,
        managerEmail: c.manager?.email ?? null,
      },
    });
    console.log(`  Criado: ${c.name} (${c.position})`);
    created++;
  }

  console.log(`\nConcluído: ${created} criados, ${skipped} já existiam.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
