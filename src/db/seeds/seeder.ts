import { Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { SeedRegistry } from '../entities/seed-registry.entity';

export abstract class Seeder {
  private readonly logger = new Logger(this.constructor.name);

  constructor(protected dataSource: DataSource) {}

  abstract run(manager: EntityManager): Promise<void>;

  protected async hasSeedBeenExecuted(seedName: string): Promise<boolean> {
    const seedRegistryRepository: Repository<SeedRegistry> =
      this.dataSource.getRepository(SeedRegistry);

    const seed = await seedRegistryRepository.findOne({
      where: { seed_name: seedName },
    });

    return !!seed;
  }

  protected async markSeedAsExecuted(
    seedName: string,
    transaction: EntityManager,
  ): Promise<void> {
    await transaction.insert(SeedRegistry, {
      seed_name: seedName,
      executed_at: new Date(),
    });
  }

  async execute(): Promise<void> {
    const seedName = this.constructor.name;

    const alreadyExecuted = await this.hasSeedBeenExecuted(seedName);

    if (alreadyExecuted) {
      this.logger.log(`The seed '${seedName}' has already been executed.`);
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      await this.run(manager);
      await this.markSeedAsExecuted(seedName, manager);
    });

    this.logger.log(`The seed '${seedName}' executed successfully`);
  }
}
