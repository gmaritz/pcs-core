// ==========================================================
// API Response Helper
// ==========================================================

import { Response } from 'express';

export class ApiResponse {

  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
  ): Response {

    return res.status(200).json({

      success: true,

      message,

      data,

    });

  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Created',
  ): Response {

    return res.status(201).json({

      success: true,

      message,

      data,

    });

  }

  static noContent(
    res: Response,
  ): Response {

    return res.sendStatus(204);

  }

}