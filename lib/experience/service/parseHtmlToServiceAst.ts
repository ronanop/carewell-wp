/**
 * Service AST — WordPress service HTML → shared ArticleDocument.
 * Does not fork the blog parser; re-exports with service naming.
 */

export {
  parseHtmlToArticleAst as parseHtmlToServiceAst,
  stripPluginToc,
  extractAndRemoveFaqs,
} from "@/lib/blog/article/parseHtmlToArticleAst";

export type { ArticleDocument as ServiceAstDocument } from "@/types/article-ast";
