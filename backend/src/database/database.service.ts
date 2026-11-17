import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        'postgresql://postgres:postgres@localhost:5432/antenas_de_ouro',
    });
  }

  async onModuleInit() {
    // Testa a conexão assim que o servidor sobe
    const client = await this.pool.connect();
    client.release();
    console.log('Conectado ao PostgreSQL (antenas_de_ouro)!');
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  getPool(): Pool {
    return this.pool;
  }
}