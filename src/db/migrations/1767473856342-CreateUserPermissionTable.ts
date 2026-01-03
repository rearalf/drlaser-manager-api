import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPermissionTable1767473856342
  implements MigrationInterface
{
  name = 'CreateUserPermissionTable1767473856342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_permission" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "permission_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a7326749e773c740a7104634a77" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_permission"."user_id" IS 'Foreign key to the User table'; COMMENT ON COLUMN "user_permission"."permission_id" IS 'Foreign key to the Permission table'; COMMENT ON COLUMN "user_permission"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "user_permission"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "user_permission"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD CONSTRAINT "FK_2305dfa7330dd7f8e211f4f35d9" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD CONSTRAINT "FK_8a4d5521c1ced158c13438df3df" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT "FK_8a4d5521c1ced158c13438df3df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT "FK_2305dfa7330dd7f8e211f4f35d9"`,
    );
    await queryRunner.query(`DROP TABLE "user_permission"`);
  }
}
