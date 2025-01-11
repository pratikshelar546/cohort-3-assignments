import { PrismaClient } from "@prisma/client"

const PrismaClientSingleTon = () => {
    return new PrismaClient();

}

declare global {
    // eslint-disable-next-line no-var
    var prisma: undefined | ReturnType<typeof PrismaClientSingleTon>
}
const prisma = globalThis.prisma ?? PrismaClientSingleTon();
export default prisma


if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma