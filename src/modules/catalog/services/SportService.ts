// ==========================================================
// Imports
// ==========================================================

import { Prisma, Sport } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';
import { slugService } from '../../shared/services';

import {
  CreateSportDto,
  UpdateSportDto,
} from '../types/sport.dto';

// ==========================================================
// Sport Service
// ==========================================================

export class SportService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single sport.
   */
  async getSport(
    id: string,
  ): Promise<Sport | null> {

    return this.db.sport.findUnique({

      where: { id },

    });

  }

  /**
   * Retrieve sports.
   */
  async getSports(
    options?: Prisma.SportFindManyArgs,
  ): Promise<Sport[]> {

    return this.db.sport.findMany(options);

  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new sport.
   */
  async createSport(
    dto: CreateSportDto,
  ): Promise<Sport> {

    const slug = slugService.generate(
      dto.name,
    );

    const data: Prisma.SportCreateInput = {

      name: dto.name,

      code: dto.name
        .substring(0, 3)
        .toUpperCase(),

      slug,

      description: dto.description,

      displayOrder:
        dto.displayOrder ?? 0,

    };

    return this.db.sport.create({

      data,

    });

  }

  /**
   * Update an existing sport.
   */
  async updateSport(
    id: string,
    dto: UpdateSportDto,
  ): Promise<Sport> {

    const data: Prisma.SportUpdateInput =
      {};

    if (dto.name !== undefined) {

      data.name = dto.name;

      data.slug = slugService.generate(
        dto.name,
      );

    }

    if (dto.description !== undefined) {
      data.description =
        dto.description;
    }

    if (dto.displayOrder !== undefined) {
      data.displayOrder =
        dto.displayOrder;
    }

    return this.db.sport.update({

      where: { id },

      data,

    });

  }

  /**
   * Delete a sport.
   */
  async deleteSport(
    id: string,
  ): Promise<Sport> {

    return this.db.sport.delete({

      where: { id },

    });

  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const sportService =
  new SportService();