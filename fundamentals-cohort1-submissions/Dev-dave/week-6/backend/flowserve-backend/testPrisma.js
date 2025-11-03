import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "David Okanlawon",
      email: "david@example.com",
    },
  });
  console.log("✅ User created:", user);
}

main()
  .catch((err) => console.error(err))
  .finally(async () => await prisma.$disconnect());
