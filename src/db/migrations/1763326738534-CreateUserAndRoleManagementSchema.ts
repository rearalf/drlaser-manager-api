import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndRoleManagementSchema1763326738534
  implements MigrationInterface
{
  name = 'CreateUserAndRoleManagementSchema1763326738534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")); COMMENT ON COLUMN "user"."email" IS 'Unique email address of the user'; COMMENT ON COLUMN "user"."password" IS 'User password (stored as a hash)'; COMMENT ON COLUMN "user"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "user"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "user"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role" ("id" SERIAL NOT NULL, "role_id" integer NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_f634684acb47c1a158b83af5150" UNIQUE ("user_id", "role_id"), CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_role"."role_id" IS 'Foreign key to the Role table'; COMMENT ON COLUMN "user_role"."user_id" IS 'Foreign key to the User table'; COMMENT ON COLUMN "user_role"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "user_role"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "user_role"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, "label" character varying(100) NOT NULL, "parent_permission_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "UQ_a4bf9ff0bad14f236b26ab4a5a6" UNIQUE ("label"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id")); COMMENT ON COLUMN "permission"."name" IS 'Unique programmatic name of the permission'; COMMENT ON COLUMN "permission"."description" IS 'Detailed description of the permission capability'; COMMENT ON COLUMN "permission"."label" IS 'User-friendly label for the permission'; COMMENT ON COLUMN "permission"."parent_permission_id" IS 'Foreign key to the parent permission'; COMMENT ON COLUMN "permission"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "permission"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "permission"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permission" ("id" SERIAL NOT NULL, "role_id" integer NOT NULL, "permission_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_19a94c31d4960ded0dcd0397759" UNIQUE ("role_id", "permission_id"), CONSTRAINT "PK_96c8f1fd25538d3692024115b47" PRIMARY KEY ("id")); COMMENT ON COLUMN "role_permission"."role_id" IS 'Foreign key to the Role table'; COMMENT ON COLUMN "role_permission"."permission_id" IS 'Foreign key to the Permission table'; COMMENT ON COLUMN "role_permission"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "role_permission"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "role_permission"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")); COMMENT ON COLUMN "role"."name" IS 'Unique name of the role'; COMMENT ON COLUMN "role"."description" IS 'Detailed description of the role capabilities'; COMMENT ON COLUMN "role"."created_at" IS 'Timestamp of the record creation'; COMMENT ON COLUMN "role"."updated_at" IS 'Timestamp of the last record update'; COMMENT ON COLUMN "role"."deleted_at" IS 'Soft deletion timestamp'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_561bebba0a2f12a237a569ad694" FOREIGN KEY ("parent_permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_561bebba0a2f12a237a569ad694"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_d0e5815877f7395a198a4cb0a46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f"`,
    );
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "role_permission"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
