import prisma from './models/articles'

export const getAuthorIdByArticleId = async function (articleId: number) {
  const article = await prisma.findUnique({
    where: { id: articleId },
    include: { author: true },
  });
  if (!article) {
    throw new Error('Author not found');
  }
  return article.author;
}
