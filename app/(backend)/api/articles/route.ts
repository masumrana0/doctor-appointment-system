import { ArticleController } from "../../_modules/article/controller/article.controller";

export const POST = ArticleController.createArticle;

export const PATCH = ArticleController.updateArticle;

export const DELETE = ArticleController.deleteArticle;

export const GET = ArticleController.getAllArticle;
