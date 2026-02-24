const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");
  
  // Create 10 users
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        password: 'password123', // Use bcrypt in real scenarios!
        posts: {
          create: [
            { content: faker.lorem.sentence() },
            { content: faker.lorem.sentence() },
          ]
        }
      }
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());