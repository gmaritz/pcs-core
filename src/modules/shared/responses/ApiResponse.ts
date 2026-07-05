// ==========================================================
// API Response Helper
// ==========================================================

import { Response } from 'express';

export class ApiResponse {

  static success<T>(
    res: Response,
    data: T,
  ): Response {

    return res.status(200).json(data);

  }

  static created<T>(
    res: Response,
    data: T,
  ): Response {

    return res.status(201).json(data);

  }

  static noContent(
    res: Response,
  ): Response {

    return res.sendStatus(204);

  }

  static notFound(
    res: Response,
    message: string,
  ): Response {

    return res.status(404).json({
      message,
    });

  }

}