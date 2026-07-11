// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateMediaDto,
  UpdateMediaDto,
} from '../types/media.dto';

import { mediaService } from '../services';

import {
  validateCreateMedia,
  validateUpdateMedia,
} from '../validation/media.validation';

// ==========================================================
// Media Controller
// ==========================================================

export class MediaController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all media records.
   */
  async getMedia(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const media =
      await mediaService.getMedia();

    ApiResponse.success(
      res,
      media,
    );

  }

  /**
   * Retrieve a single media record.
   */
  async getMediaItem(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const media =
      await mediaService.getMediaItem(
        req.params.id,
      );

    if (!media) {

      ApiResponse.notFound(
        res,
        'Media not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      media,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createMedia(
    req: Request<
      unknown,
      unknown,
      CreateMediaDto
    >,
    res: Response,
  ): Promise<void> {

    validateCreateMedia(
      req.body,
    );

    const media =
      await mediaService.createMedia(
        req.body,
      );

    ApiResponse.created(
      res,
      media,
    );

  }

  async updateMedia(
    req: Request<
      IdParams,
      unknown,
      UpdateMediaDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateMedia(
      req.body,
    );

    const media =
      await mediaService.updateMedia(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      media,
    );

  }

  async deleteMedia(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await mediaService.deleteMedia(
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

export const mediaController =
  new MediaController();
