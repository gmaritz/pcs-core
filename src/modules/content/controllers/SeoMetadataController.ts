// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateSeoMetadataDto,
  UpdateSeoMetadataDto,
} from '../types/seo-metadata.dto';

import { seoMetadataService } from '../services';

import {
  validateCreateSeoMetadata,
  validateUpdateSeoMetadata,
} from '../validation/seo-metadata.validation';

// ==========================================================
// SEO Metadata Controller
// ==========================================================

export class SeoMetadataController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all SEO metadata records.
   */
  async getSeoMetadata(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const seoMetadata =
      await seoMetadataService.getSeoMetadata();

    ApiResponse.success(
      res,
      seoMetadata,
    );

  }

  /**
   * Retrieve a single SEO metadata record.
   */
  async getSeoMetadataItem(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const seoMetadata =
      await seoMetadataService.getSeoMetadataItem(
        req.params.id,
      );

    if (!seoMetadata) {

      ApiResponse.notFound(
        res,
        'SEO Metadata not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      seoMetadata,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createSeoMetadata(
    req: Request<
      unknown,
      unknown,
      CreateSeoMetadataDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateSeoMetadata(
      req.body,
    );

    const seoMetadata =
      await seoMetadataService.createSeoMetadata(
        req.body,
      );

    ApiResponse.created(
      res,
      seoMetadata,
    );

  }

  async updateSeoMetadata(
    req: Request<
      IdParams,
      unknown,
      UpdateSeoMetadataDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateSeoMetadata(
      req.body,
    );

    const seoMetadata =
      await seoMetadataService.updateSeoMetadata(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      seoMetadata,
    );

  }

  async deleteSeoMetadata(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await seoMetadataService.deleteSeoMetadata(
      req.params.id,
    );

    ApiResponse.noContent(
      res,
    );

  }

}

// ==========================================================
// Controller Instance
// ==========================================================

export const seoMetadataController =
  new SeoMetadataController();
