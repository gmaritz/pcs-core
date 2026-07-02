// ==========================================================
// Imports
// ==========================================================

import { Prisma, Specification } from '@prisma/client';

import { BaseService } from '../../shared/services/BaseService';

// ==========================================================
// Specification Service
// ==========================================================

export class SpecificationService extends BaseService {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve a single specification by its unique identifier.
   */
  async getSpecification(id: string): Promise<Specification | null> {
    return this.db.specification.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Retrieve all specifications ordered alphabetically.
   */
  async getSpecifications(): Promise<Specification[]> {
    return this.db.specification.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  // ========================================================
  // Commands
  // ========================================================

  /**
   * Create a new specification.
   */
  async createSpecification(
    data: Prisma.SpecificationCreateInput,
  ): Promise<Specification> {
    return this.db.specification.create({
      data,
    });
  }

  /**
   * Update an existing specification.
   */
  async updateSpecification(
    id: string,
    data: Prisma.SpecificationUpdateInput,
  ): Promise<Specification> {
    return this.db.specification.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * Delete a specification.
   */
  async deleteSpecification(id: string): Promise<Specification> {
    return this.db.specification.delete({
      where: {
        id,
      },
    });
  }

}

// ==========================================================
// Service Instance
// ==========================================================

export const specificationService = new SpecificationService();