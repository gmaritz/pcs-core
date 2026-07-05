// ==========================================================
// Imports
// ==========================================================

import { Request, Response } from 'express';

import { IdParams } from '../../shared/types';
import { ApiResponse } from '../../shared/responses';

import {
  CreateSportDto,
  UpdateSportDto,
} from '../types/sport.dto';

import { sportService } from '../services';

import {
  validateCreateSport,
  validateUpdateSport,
} from '../validation/sport.validation';

// ==========================================================
// Sport Controller
// ==========================================================

export class SportController {

  // ========================================================
  // Queries
  // ========================================================

  /**
   * Retrieve all sports.
   */
  async getSports(
    _req: Request,
    res: Response,
  ): Promise<void> {

    const sports =
      await sportService.getSports();

    ApiResponse.success(
      res,
      sports,
    );

  }

  /**
   * Retrieve a single sport.
   */
  async getSport(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    const sport =
      await sportService.getSport(
        req.params.id,
      );

    if (!sport) {

      ApiResponse.notFound(
        res,
        'Sport not found.',
      );

      return;

    }

    ApiResponse.success(
      res,
      sport,
    );

  }

  // ========================================================
  // Commands
  // ========================================================

  async createSport(
    req: Request<
      unknown,
      unknown,
      CreateSportDto
    >,
    res: Response,
  ): Promise<void> {

    console.log('POST Sport Body:', req.body);

    validateCreateSport(
      req.body,
    );

    const sport =
      await sportService.createSport(
        req.body,
      );

    ApiResponse.created(
      res,
      sport,
    );

  }

  async updateSport(
    req: Request<
      IdParams,
      unknown,
      UpdateSportDto
    >,
    res: Response,
  ): Promise<void> {

    validateUpdateSport(
      req.body,
    );

    const sport =
      await sportService.updateSport(
        req.params.id,
        req.body,
      );

    ApiResponse.success(
      res,
      sport,
    );

  }

  async deleteSport(
    req: Request<IdParams>,
    res: Response,
  ): Promise<void> {

    await sportService.deleteSport(
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

export const sportController =
  new SportController();