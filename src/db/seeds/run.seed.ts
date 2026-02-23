import { connectionSource } from 'src/config/typeorm';

import { PersonTypeSeed } from './person-type.seed';
import { PermissionSeed } from './permission.seed';
import { SpecialtySeed } from './specialty/specialties.seeder';

async function runSeeders(): Promise<void> {
  const dataSource = await connectionSource.initialize();

  const personType = new PersonTypeSeed(dataSource);
  const permission = new PermissionSeed(dataSource);
  const specialtySeed = new SpecialtySeed(dataSource);

  try {
    await personType.execute();
    await permission.execute();
    await specialtySeed.execute();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in seeder execution: ', error);
  } finally {
    await dataSource.destroy();
  }
}

// eslint-disable-next-line no-console
runSeeders().catch((error) => console.log(error));
