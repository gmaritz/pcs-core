// ==========================================================
// Imports
// ==========================================================

import { Prisma, Sport } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

// ==========================================================
// Sport Service
// ==========================================================

export class SportService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single sport by its unique identifier.
   */
  async getSport(id: string): Promise<Sport | null> {
    return this.db.sport.findUnique({
      where: {
        id,
      },
    });
  }

  /**
 * Retrieve sports.
 *
 * Supports filtering, pagination, sorting,
 * includes and field selection through Prisma.
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
    data: Prisma.SportCreateInput,
  ): Promise<Sport> {
    return this.db.sport.create({
      data,
    });
  }

  /**
   * Update an existing sport.
   */
  async updateSport(
    id: string,
    data: Prisma.SportUpdateInput,
  ): Promise<Sport> {
    return this.db.sport.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Delete a sport.
   */
  async deleteSport(id: string): Promise<Sport> {
    return this.db.sport.delete({
      where: {
        id,
      },
    });
  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const sportService = new SportService();