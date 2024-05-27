import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class HelpersService {
  constructor(private dbSource: DataSource) {
    //
    this.dbManager = this.dbSource.manager;
  }

  private dbManager: EntityManager;
}
