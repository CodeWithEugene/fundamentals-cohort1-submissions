import prisma from "../config/db.js";

export const createTransaction = async (req, res, next) => {
  try {
    const { userId, amount, type } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const transaction = await prisma.transaction.create({
      data: { userId, amount, type },
    });

    const newBalance =
      type === "deposit" ? user.balance + amount : user.balance - amount;

    await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { user: true },
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};
