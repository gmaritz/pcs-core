import { prisma } from '../../../infrastructure/database';

export abstract class BaseService {

  protected readonly db = prisma;

}