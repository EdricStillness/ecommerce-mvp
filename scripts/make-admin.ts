import { PrismaClient, Role } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: pnpm make-admin <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  if (user.role === Role.ADMIN) {
    console.log(`User ${email} is already ADMIN.`);
    return;
  }

  await prisma.user.update({ where: { id: user.id }, data: { role: Role.ADMIN } });
  console.log(`Promoted ${email} to ADMIN.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
