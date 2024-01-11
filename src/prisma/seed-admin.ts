import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import argon2 from 'argon2'

async function main() {
  const hashPassword = await argon2.hash('12345678')

  const payload = {
    email: 'admin@dev.com',
    hashPassword: hashPassword,
    role: 'admin'
  }

  const data = await prisma.users.create({
    data: {
      email: payload.email,
      name: 'Admin',
      password: hashPassword,
      role: payload.role
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
