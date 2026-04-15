import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { Tag } from './tags/entities/tag.entity';
import { Post } from './posts/entities/post.entity';
import { Comment } from './posts/entities/comment.entity';
import { Like } from './posts/entities/like.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'codeConnect',
  entities: [User, Tag, Post, Comment, Like],
  synchronize: true,
});

function pick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected. Seeding...');

  // Clear existing data in correct order
  await AppDataSource.query('DELETE FROM likes');
  await AppDataSource.query('DELETE FROM comments');
  await AppDataSource.query('DELETE FROM post_tags');
  await AppDataSource.query('DELETE FROM posts');
  await AppDataSource.query('DELETE FROM tags');
  await AppDataSource.query('DELETE FROM users');

  // 1. Criar usuários
  const userRepo = AppDataSource.getRepository(User);
  const usersData = [
    { name: 'Ana Souza', email: 'ana@example.com', password: 'senha123' },
    { name: 'Bruno Lima', email: 'bruno@example.com', password: 'senha123' },
    { name: 'Carla Dias', email: 'carla@example.com', password: 'senha123' },
    { name: 'Diego Faria', email: 'diego@example.com', password: 'senha123' },
    { name: 'Elena Pinto', email: 'elena@example.com', password: 'senha123' },
  ];

  const users: User[] = [];
  for (const u of usersData) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const user = userRepo.create({
      name: u.name,
      email: u.email,
      passwordHash,
    });
    users.push(await userRepo.save(user));
  }
  console.log(`Created ${users.length} users`);

  // 2. Criar tags
  const tagRepo = AppDataSource.getRepository(Tag);
  const tagNames = [
    'Front-end',
    'React',
    'TypeScript',
    'Acessibilidade',
    'Node.js',
    'CSS',
    'UX',
    'DevOps',
    'Performance',
    'Testes',
  ];
  const tags: Tag[] = [];
  for (const name of tagNames) {
    const tag = tagRepo.create({ name });
    tags.push(await tagRepo.save(tag));
  }
  console.log(`Created ${tags.length} tags`);

  // 3. Criar posts
  const postRepo = AppDataSource.getRepository(Post);
  const postsData = [
    {
      title: 'Como usar o React 19 com Server Components',
      description:
        'Explorando as novidades do React 19, incluindo os novos hooks e as melhorias de performance com Server Components. Aprenda como migrar seu projeto existente.',
      thumbnailUrl: 'https://picsum.photos/seed/react19/800/400',
    },
    {
      title: 'TypeScript 5.4: novidades que vão mudar seu workflow',
      description:
        'Um tour pelas principais features do TypeScript 5.4, como NoInfer, melhorias de narrowing e inferência de tipos em closures. Com exemplos práticos.',
      thumbnailUrl: 'https://picsum.photos/seed/typescript54/800/400',
    },
    {
      title: 'CSS Grid vs Flexbox: quando usar cada um',
      description:
        'Guia definitivo para entender a diferença entre Grid e Flexbox e escolher a ferramenta certa para cada layout. Com exemplos visuais e casos de uso reais.',
      thumbnailUrl: null,
    },
    {
      title: 'Acessibilidade em aplicações React: um guia prático',
      description:
        'Como tornar suas aplicações React acessíveis para todos os usuários. Abordamos ARIA, navegação por teclado, contraste de cores e muito mais.',
      thumbnailUrl: 'https://picsum.photos/seed/a11y/800/400',
    },
    {
      title: 'Node.js Streams: processando grandes volumes de dados',
      description:
        'Aprenda a usar Streams no Node.js para processar arquivos gigantes sem estourar a memória. Exemplos com Readable, Writable e Transform streams.',
      thumbnailUrl: null,
    },
    {
      title: 'Testes automatizados com Vitest e React Testing Library',
      description:
        'Como escrever testes eficazes para componentes React usando Vitest e Testing Library. Do setup à cobertura de 80%, passo a passo.',
      thumbnailUrl: 'https://picsum.photos/seed/vitest/800/400',
    },
    {
      title: 'DevOps para desenvolvedores front-end',
      description:
        'Tudo que um desenvolvedor front-end precisa saber sobre CI/CD, Docker, deploy automatizado e monitoramento de aplicações.',
      thumbnailUrl: 'https://picsum.photos/seed/devops/800/400',
    },
    {
      title: 'Performance web: otimizando Core Web Vitals',
      description:
        'Como melhorar LCP, FID e CLS no seu site. Técnicas de otimização de imagens, lazy loading, code splitting e muito mais.',
      thumbnailUrl: null,
    },
    {
      title: 'Design System com Tailwind CSS e TypeScript',
      description:
        'Criando um design system robusto e escalável com Tailwind CSS, TypeScript e Storybook. Do token de cor ao componente de botão.',
      thumbnailUrl: 'https://picsum.photos/seed/designsys/800/400',
    },
    {
      title: 'UX Writing: como escrever interfaces que comunicam',
      description:
        'A importância do texto nas interfaces digitais. Aprenda princípios de UX Writing para criar mensagens claras, úteis e humanas.',
      thumbnailUrl: null,
    },
    {
      title: 'Monorepos com pnpm Workspaces e Turborepo',
      description:
        'Como estruturar um monorepo escalável usando pnpm Workspaces e Turborepo. Cache inteligente, pipelines e compartilhamento de pacotes.',
      thumbnailUrl: 'https://picsum.photos/seed/monorepo/800/400',
    },
    {
      title: 'React Query v5: data fetching simplificado',
      description:
        'Tudo sobre o TanStack Query v5. Mutations, Infinite Queries, Optimistic Updates e as novas APIs que simplificam o gerenciamento de estado assíncrono.',
      thumbnailUrl: 'https://picsum.photos/seed/reactquery/800/400',
    },
    {
      title: 'Microinterações: o detalhe que faz a diferença',
      description:
        'Como pequenas animações e feedbacks visuais melhoram a experiência do usuário. Técnicas com CSS animations e Framer Motion.',
      thumbnailUrl: null,
    },
    {
      title: 'APIs REST vs GraphQL: qual escolher em 2024',
      description:
        'Comparativo completo entre REST e GraphQL para ajudar você a tomar a decisão certa para o seu próximo projeto.',
      thumbnailUrl: 'https://picsum.photos/seed/restgql/800/400',
    },
    {
      title: 'Introdução ao WebAssembly para desenvolvedores JavaScript',
      description:
        'O que é WebAssembly, como funciona e quando usá-lo. Exemplos práticos integrando WASM com JavaScript no browser.',
      thumbnailUrl: 'https://picsum.photos/seed/wasm/800/400',
    },
    {
      title: 'CSS Container Queries: o futuro do design responsivo',
      description:
        'Como usar Container Queries para criar componentes verdadeiramente responsivos ao seu contexto, não à viewport.',
      thumbnailUrl: null,
    },
    {
      title: 'Segurança em aplicações Node.js: as 10 melhores práticas',
      description:
        'Proteja sua API Node.js contra as ameaças mais comuns: SQL Injection, XSS, CSRF, Rate Limiting e muito mais.',
      thumbnailUrl: 'https://picsum.photos/seed/security/800/400',
    },
    {
      title: 'Turborepo: acelerando builds no monorepo',
      description:
        'Como configurar e otimizar pipelines de build com Turborepo. Cache remoto, paralelismo e integração com CI/CD.',
      thumbnailUrl: null,
    },
  ];

  const posts: Post[] = [];
  const tagGroups: Record<string, string[]> = {
    'Como usar o React 19 com Server Components': [
      'React',
      'Front-end',
      'Performance',
    ],
    'TypeScript 5.4: novidades que vão mudar seu workflow': [
      'TypeScript',
      'Front-end',
    ],
    'CSS Grid vs Flexbox: quando usar cada um': ['CSS', 'Front-end', 'UX'],
    'Acessibilidade em aplicações React: um guia prático': [
      'Acessibilidade',
      'React',
      'Front-end',
    ],
    'Node.js Streams: processando grandes volumes de dados': [
      'Node.js',
      'Performance',
    ],
    'Testes automatizados com Vitest e React Testing Library': [
      'Testes',
      'React',
      'Front-end',
    ],
    'DevOps para desenvolvedores front-end': ['DevOps', 'Front-end'],
    'Performance web: otimizando Core Web Vitals': [
      'Performance',
      'Front-end',
      'UX',
    ],
    'Design System com Tailwind CSS e TypeScript': [
      'CSS',
      'TypeScript',
      'Front-end',
      'UX',
    ],
    'UX Writing: como escrever interfaces que comunicam': [
      'UX',
      'Acessibilidade',
    ],
    'Monorepos com pnpm Workspaces e Turborepo': ['DevOps', 'Node.js'],
    'React Query v5: data fetching simplificado': [
      'React',
      'Front-end',
      'TypeScript',
    ],
    'Microinterações: o detalhe que faz a diferença': [
      'UX',
      'CSS',
      'Front-end',
    ],
    'APIs REST vs GraphQL: qual escolher em 2024': ['Node.js', 'TypeScript'],
    'Introdução ao WebAssembly para desenvolvedores JavaScript': [
      'Front-end',
      'Performance',
    ],
    'CSS Container Queries: o futuro do design responsivo': [
      'CSS',
      'Front-end',
    ],
    'Segurança em aplicações Node.js: as 10 melhores práticas': [
      'Node.js',
      'DevOps',
    ],
    'Turborepo: acelerando builds no monorepo': ['DevOps', 'Performance'],
  };

  for (const pd of postsData) {
    const author = users[Math.floor(Math.random() * users.length)];
    const postTagNames = tagGroups[pd.title] ?? [];
    const postTags = tags.filter((t) => postTagNames.includes(t.name));

    const post = postRepo.create({
      title: pd.title,
      description: pd.description,
      thumbnailUrl: pd.thumbnailUrl,
      authorId: author.id,
      tags: postTags,
    });
    posts.push(await postRepo.save(post));
  }
  console.log(`Created ${posts.length} posts`);

  // 4. Criar likes
  const likeRepo = AppDataSource.getRepository(Like);
  let likeCount = 0;
  for (const post of posts) {
    const likers = pick(users, Math.floor(Math.random() * users.length));
    for (const user of likers) {
      try {
        const like = likeRepo.create({ postId: post.id, userId: user.id });
        await likeRepo.save(like);
        likeCount++;
      } catch {
        // ignore unique constraint violations
      }
    }
  }
  console.log(`Created ${likeCount} likes`);

  // 5. Criar comentários
  const commentRepo = AppDataSource.getRepository(Comment);
  const commentTexts = [
    'Excelente artigo! Aprendi muito.',
    'Muito bem explicado, obrigado!',
    'Tenho uma dúvida: isso funciona com React Native também?',
    'Usei essa abordagem no trabalho e funcionou perfeitamente.',
    'Seria interessante ver um exemplo mais complexo.',
    'Parabéns pelo conteúdo de qualidade!',
    'Já estava precisando de algo assim, valeu!',
    'Poderia aprofundar na parte de testes?',
    'Conteúdo incrível, continuem assim!',
    'Esse post me salvou num projeto difícil.',
  ];
  let commentCount = 0;
  for (const post of posts) {
    const commenters = pick(users, Math.floor(Math.random() * 4));
    for (const user of commenters) {
      const content =
        commentTexts[Math.floor(Math.random() * commentTexts.length)];
      const comment = commentRepo.create({
        content,
        postId: post.id,
        authorId: user.id,
      });
      await commentRepo.save(comment);
      commentCount++;
    }
  }
  console.log(`Created ${commentCount} comments`);

  await AppDataSource.destroy();
  console.log('Seed completed!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
