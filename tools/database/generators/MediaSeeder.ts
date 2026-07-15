import { MediaRole, RecordStatus } from '@prisma/client';

import { SeedContext } from '../seed/SeedContext';

export class MediaSeeder {
  async run(context: SeedContext): Promise<number> {
    const products = await context.db.product.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    let mediaCount = 0;

    for (const product of products) {
      for (let index = 1; index <= context.dataset.media.galleryPerProduct; index += 1) {
        const filename = `${product.code.toLowerCase()}-${index}.${context.dataset.media.placeholderExt}`;
        const url = `${context.dataset.media.baseUrl}/${filename}`;
        const altText = context.dataset.media.altTemplate
          .replace('{productName}', product.name)
          .replace('{index}', String(index));

        const existing = await context.db.media.findFirst({
          where: {
            filename,
          },
        });

        const media = existing
          ? await context.db.media.update({
            where: {
              id: existing.id,
            },
            data: {
              originalFilename: filename,
              mimeType: `image/${context.dataset.media.placeholderExt}`,
              extension: context.dataset.media.placeholderExt,
              url,
              altText,
              title: product.name,
              description: `${product.name} marketing media asset ${index}.`,
              displayOrder: index,
              status: RecordStatus.ACTIVE,
            },
          })
          : await context.db.media.create({
            data: {
              filename,
              originalFilename: filename,
              mimeType: `image/${context.dataset.media.placeholderExt}`,
              extension: context.dataset.media.placeholderExt,
              url,
              altText,
              title: product.name,
              description: `${product.name} marketing media asset ${index}.`,
              displayOrder: index,
              status: RecordStatus.ACTIVE,
            },
          });

        await context.db.productMedia.upsert({
          where: {
            productId_mediaId: {
              productId: product.id,
              mediaId: media.id,
            },
          },
          create: {
            mediaRole: index === 1 ? MediaRole.PRIMARY : MediaRole.GALLERY,
            displayOrder: index,
            isPrimary: index === 1,
            product: {
              connect: {
                id: product.id,
              },
            },
            media: {
              connect: {
                id: media.id,
              },
            },
          },
          update: {
            mediaRole: index === 1 ? MediaRole.PRIMARY : MediaRole.GALLERY,
            displayOrder: index,
            isPrimary: index === 1,
          },
        });

        mediaCount += 1;
      }
    }

    return mediaCount;
  }
}
